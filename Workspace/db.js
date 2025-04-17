const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',     // PostgreSQL 사용자 이름
  host: 'localhost',     // PostgreSQL 서버 주소 (본인 PC인 경우 localhost)
  database: 'mydatabase', // 연결할 데이터베이스 이름
  password: '', // PostgreSQL 사용자 비밀번호
  port: 8800,             // PostgreSQL 포트 (기본값: 5432)
});

module.exports = pool;