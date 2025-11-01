const http = require('http');

async function testLogin() {
  return new Promise((resolve, reject) => {
    console.log('🧪 PROBANDO LOGIN DEL USUARIO');
    console.log('==============================');

    const postData = JSON.stringify({
      email: 'rmonla@frlr.utn.edu.ar',
      password: 'utn123'
    });

    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';

      console.log(`Estado HTTP: ${res.statusCode}`);
      console.log(`Headers:`, JSON.stringify(res.headers, null, 2));

      res.on('data', (chunk) => {
        data += chunk;
        console.log(`Recibiendo chunk: ${chunk.length} bytes`);
      });

      res.on('end', () => {
        console.log(`Datos totales recibidos: ${data.length} bytes`);
        console.log(`Contenido crudo: '${data}'`);

        if (data.trim() === '') {
          console.log('❌ RESPUESTA VACÍA - Esto explica el error de JSON.parse');
          console.log('💡 Posibles causas:');
          console.log('   - El servidor se cerró la conexión');
          console.log('   - Error interno del servidor');
          console.log('   - Problema de CORS');
          console.log('   - El endpoint no existe');
          resolve();
          return;
        }

        try {
          const responseData = JSON.parse(data);
          console.log(`Respuesta exitosa: ${responseData.success}`);

          if (responseData.success) {
            console.log('✅ LOGIN EXITOSO');
            console.log(`Token generado: ${responseData.data.token ? 'SÍ' : 'NO'}`);
            console.log(`Usuario: ${responseData.data.user.first_name} ${responseData.data.user.last_name}`);
            console.log(`Rol: ${responseData.data.user.role}`);
          } else {
            console.log('❌ LOGIN FALLIDO');
            console.log(`Mensaje: ${responseData.message}`);
            if (responseData.errors) {
              console.log('Errores de validación:', responseData.errors);
            }
          }
          resolve();
        } catch (error) {
          console.error('❌ Error parseando respuesta JSON:', error.message);
          console.log('Contenido que causó el error:', data);
          resolve();
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ Error en la petición HTTP:', error.message);
      resolve();
    });

    req.write(postData);
    req.end();
  });
}

if (require.main === module) {
  testLogin();
}

module.exports = { testLogin };