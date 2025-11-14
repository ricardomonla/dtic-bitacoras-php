const { Pool } = require('pg');
require('dotenv').config();

// Configuración de PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Establecer search_path para incluir el esquema dtic
pool.on('connect', (client) => {
  client.query('SET search_path TO dtic, public');
});

// Función helper para ejecutar queries
const executeQuery = async (query, params = []) => {
  const client = await pool.connect();
  try {
    const result = await client.query(query, params);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  } finally {
    client.release();
  }
};

module.exports = { pool, executeQuery };