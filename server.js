const express = require('express');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;
const axios = require('axios');
const cors = require('cors');
app.use(cors());

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

app.get("/products", async (req, res) => {
  const goldPrice = await getGoldPrice();           // 403 olursa fallback 60

  // ➊ Ürünleri zenginleştir – data ismini kullan
  let data = products.map(p => {
    const priceValue = (p.popularityScore + 1) * p.weight * goldPrice;
    return {
      ...p,
      priceValue,                         // sayısal
      price: priceValue.toFixed(2) + " USD"
    };
  });

  // ➋ Query filtreleri
  const { minPrice, maxPrice } = req.query;
  if (minPrice) data = data.filter(p => p.priceValue >= Number(minPrice));
  if (maxPrice) data = data.filter(p => p.priceValue <= Number(maxPrice));

  // ➌ Cevap
  res.json(data);
});


app.listen(port, () => {
  console.log(`API listening at http://localhost:${port}`);
});
