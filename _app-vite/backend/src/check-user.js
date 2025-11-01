const { executeQuery } = require('./database');

async function checkUser() {
  try {
    console.log('🔍 VERIFICANDO USUARIO: rmonla@frlr.utn.edu.ar');
    console.log('==============================================');

    const result = await executeQuery(
      'SELECT id, dtic_id, email, first_name, last_name, password_hash, is_active, role FROM dtic.tecnicos WHERE email = $1',
      ['rmonla@frlr.utn.edu.ar']
    );

    if (result.rows.length === 0) {
      console.log('❌ Usuario NO encontrado en la base de datos');
      console.log('');
      console.log('🔧 POSIBLES SOLUCIONES:');
      console.log('1. El usuario no existe - crear usuario');
      console.log('2. Email incorrecto - verificar ortografía');
      console.log('3. Base de datos vacía - cargar datos iniciales');
      return;
    }

    const user = result.rows[0];
    console.log('✅ Usuario encontrado:');
    console.log(`   ID: ${user.id}`);
    console.log(`   DTIC ID: ${user.dtic_id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Nombre: ${user.first_name} ${user.last_name}`);
    console.log(`   Rol: ${user.role}`);
    console.log(`   Activo: ${user.is_active ? 'SÍ' : 'NO'}`);
    console.log(`   Tiene contraseña: ${!!user.password_hash ? 'SÍ' : 'NO'}`);

    if (!user.is_active) {
      console.log('');
      console.log('⚠️  USUARIO INACTIVO - No puede iniciar sesión');
    }

    if (!user.password_hash) {
      console.log('');
      console.log('⚠️  USUARIO SIN CONTRASEÑA - Necesita configuración inicial');
    }

  } catch (error) {
    console.error('❌ Error verificando usuario:', error);
  }
}

if (require.main === module) {
  checkUser();
}

module.exports = { checkUser };