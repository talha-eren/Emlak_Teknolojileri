# 🚀 Hızlı Kurulum Kılavuzu

## Mülakat İçin Hazırlık

Bu proje **Docker** ile çalışır ve **otomatik olarak mock data** yükler.

## ⚡ 3 Adımda Başlat

### 1️⃣ Docker'ı Başlat
```bash
docker-compose up -d
```

### 2️⃣ Tarayıcıda Aç
```
http://localhost:3000
```

### 3️⃣ Giriş Yap
```
Email: admin@jokersoft.com
Şifre: admin123
```

## ✅ Otomatik Yüklenen Mock Data

Sistem ilk çalıştırıldığında otomatik olarak şunları yükler:

- ✅ 1 Admin kullanıcı
- ✅ 2 Franchise (İstanbul, Ankara)
- ✅ 6 Ofis (rastgele danışman sayıları ile)

**Hiçbir manuel işlem gerekmez!**

## 🎯 Test Senaryoları

### 1. Dashboard
- Toplam istatistikleri görün
- Grafikleri inceleyin
- Aktivite loglarını kontrol edin

### 2. Franchise Yönetimi
- Franchise bilgilerini düzenleyin
- PDF olarak indirin

### 3. Ofis Yönetimi
- Ofis listesini görün
- Danışman sayılarını düzenleyin
- "Yazdır" butonuyla PDF oluşturun

### 4. Profil
- Profil bilgilerinizi güncelleyin
- Şifre değiştirin
- Dashboard'da aktivite logunu görün

### 5. Chatbot
- Sağ alttaki chatbot'u açın
- Hızlı komutları deneyin
- PDF/Excel oluşturun

## 🔄 Yeniden Başlatma

Eğer sıfırdan başlamak isterseniz:

```bash
docker-compose down -v
docker-compose up -d
```

Bu komut veritabanını siler ve yeni mock data yükler.

## 📊 Özellikler

### ✅ Backend
- FastAPI + PostgreSQL
- JWT Authentication
- RESTful API
- Otomatik Mock Data
- Aktivite Logları

### ✅ Frontend
- Next.js 14 + TypeScript
- Tailwind CSS
- Responsive Design
- PDF/Excel Export
- AI Chatbot
- Grafikler

## 🐛 Sorun Giderme

### Port zaten kullanılıyor
```bash
# Portları değiştirin docker-compose.yml'de
# Frontend: 3000 -> 3001
# Backend: 8000 -> 8001
```

### Docker çalışmıyor
```bash
# Docker Desktop'ı başlatın
# Ardından tekrar deneyin
docker-compose up -d
```

## 📝 API Dokümantasyonu

Backend API dokümantasyonu:
```
http://localhost:8000/docs
```

## 💡 İpuçları

1. **Hard Refresh:** Değişiklikleri görmek için `Ctrl+Shift+R`
2. **Aktivite Logları:** Her işlem otomatik kaydedilir
3. **PDF Export:** Her sayfada PDF/Excel export var
4. **Chatbot:** Hızlı işlemler için chatbot'u kullanın

## ✨ Mülakat Notları

- ✅ Proje tamamen Docker ile çalışır
- ✅ Mock data otomatik yüklenir
- ✅ Tüm özellikler çalışır durumda
- ✅ Responsive tasarım
- ✅ Modern UI/UX
- ✅ Type-safe (TypeScript)
- ✅ RESTful API
- ✅ JWT Authentication
- ✅ Aktivite takibi

**Başarılar! 🎉**

