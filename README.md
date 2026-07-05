# Gece Rutini

Kalori takibi (fotoğraf destekli AI tahmini ile), gece egzersiz programı, günlük kayıt ve hedef takibi. Bu sürüm bir Node/Express sunucusu içerir; AI fotoğraf tahmini isteği sunucu üzerinden, gizli tutulan bir API anahtarıyla yapılır — kullanıcıların kendi anahtarını girmesine gerek yoktur.

## Railway'e Yükleme

1. Bu klasörü bir GitHub reposuna yükle (ya da doğrudan Railway CLI ile deploy et).
2. [railway.app](https://railway.app) üzerinde **New Project → Deploy from GitHub repo** ile bu repoyu seç.
3. Railway otomatik olarak `package.json`'daki `start` komutunu (`node server.js`) çalıştırır, ek bir ayara gerek yok.
4. Projenin **Variables** (ortam değişkenleri) sekmesine git ve şunu ekle:
   - `ANTHROPIC_API_KEY` = kendi Anthropic API anahtarın (console.anthropic.com/settings/keys adresinden alınır)
5. Deploy tamamlandığında Railway sana bir URL verir (örn. `https://gece-rutini-production.up.railway.app`). Bu adresi Safari'de açıp "Ana Ekrana Ekle" diyerek telefonuna kurabilirsin.

## Yerel test

```
npm install
ANTHROPIC_API_KEY=sk-ant-... npm start
```

Sonra tarayıcıda `http://localhost:3000` adresini aç.

## Notlar

- Kalori/egzersiz/günlük verileri kullanıcının kendi tarayıcısında (localStorage) tutulur — sunucuda bir veritabanı yoktur, kullanıcılar arasında veri paylaşılmaz.
- `ANTHROPIC_API_KEY` yalnızca Railway'in ortam değişkenlerinde saklanır, koda veya istemciye hiç gönderilmez.
- iPhone'da web uygulamaları (Safari tabanlı Ana Ekran uygulamaları dahil) telefon tamamen kilitliyken arka planda çalışamaz; bu platform kısıtı sunucu tarafına taşınınca da geçerliliğini korur.
