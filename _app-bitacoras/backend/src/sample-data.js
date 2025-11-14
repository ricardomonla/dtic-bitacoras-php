const { executeQuery } = require('./database');

const sampleTasks = [
  {
    title: 'Revisar configuración de red',
    description: 'Verificar configuración de switches y routers en sala de servidores',
    priority: 'high',
    status: 'pending'
  },
  {
    title: 'Actualizar software antivirus',
    description: 'Actualizar definiciones de virus en todos los equipos',
    priority: 'medium',
    status: 'in_progress'
  },
  {
    title: 'Configurar backup automático',
    description: 'Implementar sistema de backup diario para bases de datos críticas',
    priority: 'urgent',
    status: 'pending'
  },
  {
    title: 'Instalar actualizaciones Windows',
    description: 'Aplicar parches de seguridad en servidores Windows',
    priority: 'medium',
    status: 'completed'
  },
  {
    title: 'Diagnosticar problema de impresora',
    description: 'Resolver error de conexión en impresora multifunción',
    priority: 'low',
    status: 'pending'
  },
  {
    title: 'Configurar VPN para usuarios remotos',
    description: 'Establecer conexiones seguras para trabajo remoto',
    priority: 'high',
    status: 'in_progress'
  },
  {
    title: 'Auditoría de seguridad mensual',
    description: 'Revisar logs y vulnerabilidades del sistema',
    priority: 'medium',
    status: 'pending'
  },
  {
    title: 'Migración de datos a nuevo servidor',
    description: 'Transferir archivos y configuraciones al servidor actualizado',
    priority: 'urgent',
    status: 'pending'
  }
];

async function insertSampleData() {
  try {
    console.log('Cleaning existing sample tasks...');

    // Limpiar tareas existentes que podrían tener IDs incorrectos
    await executeQuery('DELETE FROM dtic.tareas WHERE dtic_id LIKE \'TAR%\' AND title IN ($1, $2, $3, $4, $5, $6, $7, $8)', [
      'Revisar configuración de red',
      'Actualizar software antivirus',
      'Configurar backup automático',
      'Instalar actualizaciones Windows',
      'Diagnosticar problema de impresora',
      'Configurar VPN para usuarios remotos',
      'Auditoría de seguridad mensual',
      'Migración de datos a nuevo servidor'
    ]);

    console.log('Inserting sample tasks with correct DTIC IDs...');

    for (const task of sampleTasks) {
      const dticId = 'TAR-' + Math.floor(Math.random() * 10000).toString().padStart(4, '0');

      await executeQuery(
        'INSERT INTO dtic.tareas (dtic_id, title, description, priority, status, created_at) VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)',
        [dticId, task.title, task.description, task.priority, task.status]
      );

      console.log(`✓ Inserted task: ${task.title} (ID: ${dticId})`);
    }

    console.log('\n🎉 Sample tasks inserted successfully with correct DTIC IDs!');
    console.log('You can now view the tasks in the TareasRefactored page.');

  } catch (error) {
    console.error('❌ Error inserting sample data:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  insertSampleData();
}

module.exports = { insertSampleData, sampleTasks };