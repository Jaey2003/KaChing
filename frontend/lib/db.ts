import mysql from 'mysql2/promise';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local from project root (one directory above frontend/)
config({ path: resolve(process.cwd(), '..', '.env.local'), override: true });

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'kaching',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

console.log('[DB] Loaded config:', {
  host: dbConfig.host,
  port: dbConfig.port,
  user: dbConfig.user,
  database: dbConfig.database,
  password: dbConfig.password ? '***SET***' : '***EMPTY***',
});

const pool = mysql.createPool(dbConfig);

export async function testConnection() {
  try {
    const conn = await pool.getConnection();
    console.log('[DB] Connection test SUCCESS');
    conn.release();
    return true;
  } catch (err: any) {
    console.error('[DB] Connection test FAILED:', err.message, '| code:', err.code);
    return false;
  }
}

export default pool;
