const express = require('express');
const app = express();
const port = 8800;
const cors = require('cors');
const pool = require('./db');

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const userRouter = require('./User/user');
app.use('/user', userRouter);

app.get('/home', (req, res) => {
  res.sendFile(__dirname + '/index.html');
})

app.get('/ubuntu08/api/vi/', async (req, res)=> {
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

app.listen(port, () => {
  console.log(`server Start at ${port} port`);
});


