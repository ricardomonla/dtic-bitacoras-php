const { executeQuery } = require('./database');
const bcrypt = require('bcryptjs');

async function checkPassword() {
  try {
    console.log('🔐 VERIFICANDO CONTRASEÑA DEL USUARIO');
    console.log('=====================================');

    const result = await executeQuery(
      'SELECT password_hash FROM dtic.tecnicos WHERE email = $1',
      ['rmonla@frlr.utn.edu.ar']
    );

    if (result.rows.length === 0) {
      console.log('❌ Usuario no encontrado');
      return;
    }

    const hash = result.rows[0].password_hash;
    console.log(`Hash encontrado: ${hash ? 'SÍ' : 'NO'}`);

    if (hash) {
      const testPasswords = ['utn123', 'password', 'admin123', '123456'];

      console.log('');
      console.log('🧪 Probando contraseñas comunes:');

      for (const password of testPasswords) {
        const isValid = await bcrypt.compare(password, hash);
        console.log(`   "${password}": ${isValid ? '✅ VÁLIDA' : '❌ Inválida'}`);
      }

      console.log('');
      console.log('💡 Si ninguna contraseña funciona, el usuario necesita reset de contraseña');
      console.log('   O la contraseña fue cambiada desde la última vez que se configuró');

    } else {
      console.log('⚠️  El usuario no tiene contraseña configurada');
    }

  } catch (error) {
    console.error('❌ Error verificando contraseña:', error);
  }
}

if (require.main === module) {
  checkPassword();
}

module.exports = { checkPassword };