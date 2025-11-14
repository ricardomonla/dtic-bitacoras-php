const { executeQuery } = require('./database');

// Función para verificar la integridad de los datos
async function verifyDataIntegrity() {
    try {
        console.log('🔍 Verificando integridad de datos...\n');

        // Verificar recursos
        const recursos = await executeQuery('SELECT COUNT(*) as total, category, status FROM dtic.recursos GROUP BY category, status ORDER BY category, status');
        console.log('📦 Recursos por categoría y estado:');
        recursos.rows.forEach(row => {
            console.log(`   ${row.category} (${row.status}): ${row.total}`);
        });

        // Verificar usuarios
        const usuarios = await executeQuery('SELECT COUNT(*) as total FROM dtic.usuarios_relacionados');
        console.log(`👥 Total de usuarios relacionados: ${usuarios.rows[0].total}`);

        // Verificar tareas
        const tareas = await executeQuery('SELECT COUNT(*) as total, status, priority FROM dtic.tareas GROUP BY status, priority ORDER BY status, priority');
        console.log('📋 Tareas por estado y prioridad:');
        tareas.rows.forEach(row => {
            console.log(`   ${row.status} (${row.priority}): ${row.total}`);
        });

        // Verificar asignaciones
        const asignaciones = await executeQuery('SELECT COUNT(*) as total FROM dtic.recurso_asignaciones WHERE activo = true');
        console.log(`🔗 Asignaciones activas: ${asignaciones.rows[0].total}`);

        // Verificar historial
        const historial = await executeQuery('SELECT COUNT(*) as total FROM dtic.recurso_historial');
        console.log(`📜 Registros de historial: ${historial.rows[0].total}`);

        // Mostrar algunos ejemplos
        console.log('\n📋 Ejemplos de datos:');

        const sampleRecursos = await executeQuery('SELECT dtic_id, name, category FROM dtic.recursos LIMIT 5');
        console.log('Recursos:');
        sampleRecursos.rows.forEach(r => console.log(`   ${r.dtic_id}: ${r.name} (${r.category})`));

        const sampleUsuarios = await executeQuery('SELECT dtic_id, first_name, last_name, department FROM dtic.usuarios_relacionados LIMIT 5');
        console.log('Usuarios:');
        sampleUsuarios.rows.forEach(u => console.log(`   ${u.dtic_id}: ${u.first_name} ${u.last_name} (${u.department})`));

        const sampleTareas = await executeQuery('SELECT dtic_id, title, status FROM dtic.tareas LIMIT 5');
        console.log('Tareas:');
        sampleTareas.rows.forEach(t => console.log(`   ${t.dtic_id}: ${t.title} (${t.status})`));

        console.log('\n✅ Verificación completada exitosamente!');

    } catch (error) {
        console.error('❌ Error verificando integridad de datos:', error);
        throw error;
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    verifyDataIntegrity();
}

module.exports = { verifyDataIntegrity };