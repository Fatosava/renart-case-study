const express = require('express');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;
const axios = require('axios');

async function getGoldPrice() {
  try {
    const response = await axios.get('https://www.goldapi.io/api/XAU/USD', {
      headers: {
        'x-access-token': 'YOgoldapi-1jlsbk17mcto5x1k-io', //benim api anahtarım
        'Content-Type': 'application/json'
      }
    });

    return response.data.price_gram_24k;
  } catch (error) {
    console.error('Altın fiyatı alınamadı:', error.message);
    return 60; 
  }
}

// Ürün verilerini products.json dosyasından okuma kısmım
const products = JSON.parse(fs.readFileSync('./products.json'));

//Enpoint kısmım
app.get('/products', async (req, res) => {
  const goldPrice = await getGoldPrice();


  
  const enrichedProducts = products.map(product => {
    const price = (product.popularityScore + 1) * product.weight * goldPrice;
    return {
      ...product,
      price: price.toFixed(2) + ' USD',
    };
  });

  res.json(enrichedProducts);
});

app.listen(port, () => {
  console.log(`API listening at http://localhost:${port}`);
});
