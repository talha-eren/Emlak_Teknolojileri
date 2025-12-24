# RTECA Emlak Teknolojileri - Franchise Yönetim Sistemi

Full-stack Franchise ve Şube Yönetim Modülü

## 🔧 Kurulum ve Çalıştırma

### 1. Projeyi Klonlayın
```bash
git clone <repository-url>
cd RTECA
```

### 2. Docker ile Çalıştırın
```bash
docker-compose up -d
```

### 3. Tarayıcıda Açın
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs

## 🔐 Giriş Bilgileri

**Mock data otomatik olarak yüklenir:**

- **Email:** admin@jokersoft.com
- **Şifre:** admin123

## 📊 Mock Data

Sistem ilk çalıştırıldığında otomatik olarak şunları yükler:
- 1 Admin kullanıcı
- 2 Franchise (İstanbul, Ankara)
- 6 Ofis (rastgele danışman sayıları ile)

## 📁 Proje Yapısı

```
RTECA/
├── backend/
│   ├── app/
│   │   ├── routers/         # API endpoints
│   │   ├── models.py        # Database models
│   │   ├── schemas.py       # Pydantic schemas
│   │   ├── auth.py          # JWT authentication
│   │   ├── database.py      # Database connection
│   │   └── main.py          # FastAPI app + Auto-seed
│   ├── scripts/
│   │   └── seed_data.py     # Manual seed script
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── app/             # Next.js pages
│   │   ├── components/      # React components
│   │   ├── lib/             # API client & utils
│   │   └── types/           # TypeScript types
│   ├── Dockerfile
│   └── package.json
└── docker-compose.yml
```

## 🎯 Kullanım

### Dashboard
- Toplam istatistikler
- Aktivite logları
- Grafikler (Bar & Line charts)
- PDF/Excel export

### Franchise Yönetimi
- Tek franchise bilgisi
- Düzenleme modu
- PDF export

### Ofis Yönetimi
- Ofis listesi (tablo görünümü)
- Danışman sayıları
- CRUD işlemleri
- Her ofis için PDF yazdırma

### Profil
- Kullanıcı bilgileri düzenleme
- Şifre değiştirme
- Aktivite loglarına kaydedilir

### Chatbot
- AI asistan
- Hızlı komutlar
- PDF/Excel oluşturma
- Tam ekran modu


## 👨‍💻 Geliştirici

RTECA Emlak Teknolojileri için geliştirilmiştir.
Talha Eren Bilikci

## 📄 Lisans

Bu proje case study amaçlı geliştirilmiştir.Tüm hakları Talha Eren Bilikciye aittir

