const { executeQuery } = require('./database');

async function checkTasks() {
  try {
    console.log('📊 VERIFICANDO TAREAS EN BASE DE DATOS');
    console.log('=====================================');

    const result = await executeQuery(
      'SELECT dtic_id, title, status, priority, created_at FROM dtic.tareas ORDER BY created_at DESC LIMIT 10'
    );

    if (result.rows.length === 0) {
      console.log('❌ No se encontraron tareas en la base de datos');
      return;
    }

    console.log(`✅ Encontradas ${result.rows.length} tareas:`);
    console.log('');

    result.rows.forEach((task, index) => {
      console.log(`${index + 1}. ${task.dtic_id} - ${task.title}`);
      console.log(`   Estado: ${task.status} | Prioridad: ${task.priority}`);
      console.log(`   Creado: ${new Date(task.created_at).toLocaleString('es-AR')}`);
      console.log('');
    });

    // Verificar total
    const countResult = await executeQuery('SELECT COUNT(*) as total FROM dtic.tareas');
    console.log(`📈 Total de tareas en BD: ${countResult.rows[0].total}`);

  } catch (error) {
    console.error('❌ Error verificando datos:', error);
  }
}

if (require.main === module) {
  checkTasks();
}

module.exports = { checkTasks };