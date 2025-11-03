const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Hola desde Express API' });
});

app.listen(port, () => {
  console.log(`Express API corriendo en http://localhost:${port}`);
});