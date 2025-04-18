const { Client, Pool } = require('pg');

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'mydatabase', // 실제 데이터베이스 이름으로 변경
  password: '1111', // 실제 비밀번호로 변경
  port: 5432,
});
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'mydatabase', // 실제 데이터베이스 이름으로 변경
  password: '1111', // 실제 비밀번호로 변경
  port: 5432,
  max: 10 // 연결 풀 최대 연결 수 (선택 사항)
});

async function connectDB() {
  try {
    await client.connect();
    console.log('Successfully connected to PostgreSQL!');
    return client;
  } catch (error) {
    console.error('Error connecting to PostgreSQL:', error);
    return null;
  }
}

async function queryDB(query, params) {
  const client = await pool.connect();
  try {
    const result = await client.query(query, params);
    return result.rows;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  } finally {
    client.release();
  }
}
async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('Successfully connected to PostgreSQL for testing!');
    await client.release();
    return true;
  } catch (error) {
    console.error('Error testing PostgreSQL connection:', error);
    return false;
  }
}


module.exports = { pool, testConnection, queryDB };