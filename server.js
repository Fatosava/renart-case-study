const express = require('express');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;
const axios = require('axios');

async function getGoldPrice() {
  try {
    const response = await axios.get('https://www.goldapi.io/api/XAU/USD', {
      headers: {
        'x-access-token': 'YOUR_API_KEY', // 👈 BURAYA KENDİ API KEY'İNİ KOY
        'Content-Type': 'application/json'
      }
    });

    return response.data.price_gram_24k;
  } catch (error) {
    console.error('Altın fiyatı alınamadı:', error.message);
    return 60; // fallback: altın fiyatı alınamazsa sabit değer kullan
  }
}

// JSON dosyasını yükle
const products = JSON.parse(fs.readFileSync('./products.json'));

// Basit endpoint
app.get('/products', (req, res) => {
  res.json(products);
});

app.listen(port, () => {
  console.log(`API listening at http://localhost:${port}`);
});
