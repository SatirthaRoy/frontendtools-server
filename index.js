const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.send('server running on port 5000')
})


app.listen(5000);