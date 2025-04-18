const express = require('express');
const app = express();
const port = 8800;
const cors = require('cors');
const { pool, testConnection } = require('./db.js');

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const userRouter = require('./User/user');
app.use('/user', userRouter);

app.get('/home', (req, res) => {
  res.sendFile(__dirname + '/index.html');
})

app.get('/ubuntu08/api/v1/', async (req, res)=> {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch(error){
    console.error('Error fetching users', error);
    res.status(500).json({
      error: 'failed to fetch users'
    });
  }
});

// 서버 시작 시 DB 연결 테스트
async function startServer() {
  const isConnected = await testConnection();
  if (isConnected) {
    app.listen(port, () => {
      console.log(`Server running at port ${port}`);
    });
  } else {
    console.error('Server not started due to database connection issues');
  }
}

startServer();

