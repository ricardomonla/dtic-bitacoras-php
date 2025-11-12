const fs = require('fs');
const path = require('path');
const { executeQuery } = require('./database');

// Función para leer todos los archivos de bitácoras
function readBitacoraFiles() {
    // Dentro del contenedor Docker, el path es diferente
    const bitacorasDir = path.join('/host', '_bitacoras_anteriores');
    console.log('📂 Buscando bitácoras en:', bitacorasDir);

    const files = fs.readdirSync(bitacorasDir);
    const bitacoraFiles = files.filter(file => file.startsWith('bitacora_'));

    console.log(`📄 Encontrados ${bitacoraFiles.length} archivos de bitácora`);

    const data = {
        recursos: [],
        usuarios: [],
        tareas: []
    };

    bitacoraFiles.forEach(file => {
        const filePath = path.join(bitacorasDir, file);
        const content = fs.readFileSync(filePath, 'utf8');

        // Extraer recursos mencionados
        extractRecursos(content, data.recursos);

        // Extraer usuarios mencionados
        extractUsuarios(content, data.usuarios);

        // Extraer tareas mencionadas
        extractTareas(content, data.tareas);
    });

    return data;
}

// Función para extraer recursos del contenido
function extractRecursos(content, recursos) {
    // Patrones para identificar recursos
    const resourcePatterns = [
        /srvv-([A-Z0-9-]+)/g,  // srvv-SITIO, srvv-DTIC, etc.
        /dtic-([A-Z0-9-]+)/g,  // dtic-BITÁCORAS, dtic-UPTIME, etc.
        /srv-([A-Z0-9-]+)/g,   // srv-PMOX1, srv-NS8, etc.
        /pcv-([A-Z0-9-]+)/g,   // pcv-DASU1, pcv-DASU2, etc.
        /x_srvv-([A-Z0-9-]+)/g // x_srvv-TORII, etc.
    ];

    resourcePatterns.forEach(pattern => {
        let match;
        while ((match = pattern.exec(content)) !== null) {
            const resourceName = match[0];
            if (!recursos.find(r => r.name === resourceName)) {
                recursos.push({
                    name: resourceName,
                    category: categorizeResource(resourceName),
                    description: `Recurso identificado en bitácoras históricas`,
                    status: 'available',
                    location: 'DTIC - UTN La Rioja'
                });
            }
        }
    });
}

// Función para categorizar recursos
function categorizeResource(name) {
    if (name.startsWith('srvv-') || name.startsWith('srv-')) {
        return 'hardware'; // Servidores virtuales o físicos
    } else if (name.startsWith('dtic-')) {
        return 'facilities'; // Servicios DTIC
    } else if (name.startsWith('pcv-')) {
        return 'network'; // Componentes de red
    } else {
        return 'tools'; // Otros
    }
}

// Función para extraer usuarios del contenido
function extractUsuarios(content, usuarios) {
    // Patrones para identificar usuarios
    const userPatterns = [
        /rmonla/g,           // Ricardo MONLA
        /jessisanchez/g,     // Jessica Sánchez
        /silviaromero/g,     // Silvia Romero
        /sofiaemelivega/g,   // Sofía Emeli Vega
        /silromero/g         // Silvia Romero (variante)
    ];

    userPatterns.forEach(pattern => {
        let match;
        while ((match = pattern.exec(content)) !== null) {
            const userId = match[0];
            if (!usuarios.find(u => u.email === `${userId}@frlr.utn.edu.ar`)) {
                const userInfo = getUserInfo(userId);
                usuarios.push({
                    first_name: userInfo.firstName,
                    last_name: userInfo.lastName,
                    email: `${userId}@frlr.utn.edu.ar`,
                    department: 'DTIC',
                    position: userInfo.position
                });
            }
        }
    });
}

// Función para obtener información de usuario
function getUserInfo(userId) {
    const userMap = {
        'rmonla': { firstName: 'Ricardo', lastName: 'MONLA', position: 'Responsable DTIC' },
        'jessisanchez': { firstName: 'Jessica', lastName: 'SÁNCHEZ', position: 'Administradora' },
        'silviaromero': { firstName: 'Silvia', lastName: 'ROMERO', position: 'Administradora' },
        'sofiaemelivega': { firstName: 'Sofía Emeli', lastName: 'VEGA', position: 'Usuario' },
        'silromero': { firstName: 'Silvia', lastName: 'ROMERO', position: 'Administradora' }
    };

    return userMap[userId] || { firstName: userId, lastName: 'Usuario', position: 'Usuario' };
}

// Función para extraer tareas del contenido
function extractTareas(content, tareas) {
    // Buscar patrones de tareas en las bitácoras
    const taskPatterns = [
        /Actualización.*sistema operativo/g,
        /Configuración.*DNS/g,
        /Backup.*VM/g,
        /Instalación.*software/g,
        /Mantenimiento.*servidor/g,
        /Resolución.*problema/g,
        /Creación.*usuario/g,
        /Actualización.*servicio/g
    ];

    taskPatterns.forEach(pattern => {
        let match;
        while ((match = pattern.exec(content)) !== null) {
            const taskTitle = match[0];
            if (!tareas.find(t => t.title === taskTitle)) {
                tareas.push({
                    title: taskTitle,
                    description: `Tarea identificada en bitácoras históricas`,
                    status: 'completed',
                    priority: 'medium'
                });
            }
        }
    });
}

// Función principal para procesar los datos
async function processRealData() {
    try {
        console.log('🔍 Extrayendo datos reales de las bitácoras...');

        const data = readBitacoraFiles();

        console.log(`📊 Datos extraídos:`);
        console.log(`   - Recursos: ${data.recursos.length}`);
        console.log(`   - Usuarios: ${data.usuarios.length}`);
        console.log(`   - Tareas: ${data.tareas.length}`);

        // Limpiar datos existentes
        console.log('🧹 Eliminando datos existentes...');
        await clearExistingData();

        // Insertar nuevos datos
        console.log('📥 Insertando datos reales...');
        await insertRealData(data);

        console.log('✅ Proceso completado exitosamente!');

    } catch (error) {
        console.error('❌ Error procesando datos reales:', error);
    }
}

// Función para limpiar datos existentes
async function clearExistingData() {
    try {
        // Eliminar en orden correcto (por dependencias)
        await executeQuery('DELETE FROM dtic.recurso_historial');
        await executeQuery('DELETE FROM dtic.recurso_asignaciones');
        await executeQuery('DELETE FROM dtic.tareas');
        await executeQuery('DELETE FROM dtic.recursos');
        await executeQuery('DELETE FROM dtic.usuarios_relacionados');

        console.log('✅ Datos existentes eliminados');
    } catch (error) {
        console.error('❌ Error eliminando datos existentes:', error);
        throw error;
    }
}

// Función para insertar datos reales
async function insertRealData(data) {
    try {
        // Insertar recursos
        for (let i = 0; i < data.recursos.length; i++) {
            const recurso = data.recursos[i];
            const dticId = `REC-${String(i + 1).padStart(4, '0')}`;

            await executeQuery(`
                INSERT INTO dtic.recursos (dtic_id, name, description, category, status, location)
                VALUES ($1, $2, $3, $4, $5, $6)
            `, [dticId, recurso.name, recurso.description, recurso.category, recurso.status, recurso.location]);
        }

        // Insertar usuarios
        for (let i = 0; i < data.usuarios.length; i++) {
            const usuario = data.usuarios[i];
            const dticId = `USR-${String(i + 1).padStart(4, '0')}`;

            await executeQuery(`
                INSERT INTO dtic.usuarios_relacionados (dtic_id, first_name, last_name, email, department, position)
                VALUES ($1, $2, $3, $4, $5, $6)
            `, [dticId, usuario.first_name, usuario.last_name, usuario.email, usuario.department, usuario.position]);
        }

        // Insertar tareas
        for (let i = 0; i < data.tareas.length; i++) {
            const tarea = data.tareas[i];
            const dticId = `TAR-${String(i + 1).padStart(4, '0')}`;

            await executeQuery(`
                INSERT INTO dtic.tareas (dtic_id, title, description, status, priority)
                VALUES ($1, $2, $3, $4, $5)
            `, [dticId, tarea.title, tarea.description, tarea.status, tarea.priority]);
        }

        console.log('✅ Datos reales insertados correctamente');

    } catch (error) {
        console.error('❌ Error insertando datos reales:', error);
        throw error;
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    processRealData();
}

module.exports = { processRealData, readBitacoraFiles };