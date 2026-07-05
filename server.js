const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Fotoğraftan kalori tahmini — API anahtarı sadece sunucuda, gizli kalır.
app.post('/api/estimate', async (req, res) => {
  try {
    const { image } = req.body || {};
    if (!image) {
      return res.status(400).json({ error: 'Fotoğraf verisi eksik.' });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Sunucuda ANTHROPIC_API_KEY tanımlı değil. Railway ortam değişkenlerine ekleyin.' });
    }

    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 300,
        messages: [{
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: image } },
            { type: 'text', text: 'Bu fotoğraftaki yemeği/gıdayı tanı ve tahmini kalorisini hesapla. SADECE şu JSON formatında yanıt ver, başka hiçbir açıklama veya markdown ekleme: {"name": "yemek adı (Türkçe, kısa)", "kcal": tahmini_sayi}' }
          ]
        }]
      })
    });

    const data = await anthropicRes.json();

    if (!anthropicRes.ok) {
      const msg = (data && data.error && data.error.message) || 'Anthropic API hatası.';
      return res.status(anthropicRes.status).json({ error: msg });
    }

    const text = (data.content || []).map(function (c) { return c.text || ''; }).join('');
    const clean = text.replace(/```json|```/g, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(clean);
    } catch (e) {
      return res.status(502).json({ error: 'Model yanıtı ayrıştırılamadı.' });
    }

    res.json(parsed);
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası: ' + err.message });
  }
});

app.listen(PORT, () => {
  console.log('Gece Rutini sunucusu ' + PORT + ' portunda çalışıyor.');
});
