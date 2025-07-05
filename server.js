const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

// JSON dosyasını yükle
const products = JSON.parse(fs.readFileSync('./products.json'));

// Basit endpoint
app.get('/products', (req, res) => {
  res.json(products);
});

app.listen(port, () => {
  console.log(`API listening at http://localhost:${port}`);
});
