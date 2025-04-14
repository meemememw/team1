const express = require('express');
const app     = express();
const port    = 8800;

const cors    = require('cors');
app.use(cors());  
app.use(express.json());

const userRouter = require('./User/user');
app.use('/user', userRouter);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`server Start at ${port} port`);
  });