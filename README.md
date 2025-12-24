# RTECA Emlak Teknolojileri - Franchise Yönetim Sistemi

Full-stack Franchise ve Şube Yönetim Modülü

## 🚀 Özellikler

### Backend (FastAPI + PostgreSQL)
- ✅ JWT Authentication
- ✅ RESTful API
- ✅ Franchise CRUD İşlemleri
- ✅ Şube/Ofis CRUD İşlemleri
- ✅ Kullanıcı Profil Yönetimi
- ✅ Aktivite Logları
- ✅ Dashboard İstatistikleri
- ✅ Otomatik Mock Data Yükleme

### Frontend (Next.js 14 + TypeScript + Tailwind CSS)
- ✅ Modern ve Responsive UI
- ✅ Dashboard ile İstatistikler
- ✅ Franchise Yönetimi
- ✅ Ofis Yönetimi (Danışman Sayıları)
- ✅ Kullanıcı Profil Sayfası
- ✅ Aktivite Takibi
- ✅ PDF/Excel Export
- ✅ AI Chatbot
- ✅ Grafikler (Chart.js)

## 📋 Gereksinimler

- Docker Desktop
- Docker Compose

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

## 🏗️ Teknoloji Stack

### Backend
- Python 3.10+
- FastAPI
- PostgreSQL
- SQLAlchemy
- Pydantic
- JWT Authentication
- Docker

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- React Hook Form
- Axios
- Lucide Icons
- Chart.js
- jsPDF
- XLSX

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

## 🔄 API Endpoints

### Authentication
- `POST /api/auth/register` - Kullanıcı kaydı
- `POST /api/auth/login` - Giriş
- `GET /api/auth/me` - Kullanıcı bilgisi
- `PUT /api/auth/me` - Profil güncelleme

### Franchises
- `GET /api/franchises` - Tüm franchise'lar
- `GET /api/franchises/{id}` - Tek franchise
- `POST /api/franchises` - Yeni franchise
- `PUT /api/franchises/{id}` - Franchise güncelleme
- `DELETE /api/franchises/{id}` - Franchise silme

### Branches
- `GET /api/branches` - Tüm ofisler
- `GET /api/branches/{id}` - Tek ofis
- `POST /api/branches` - Yeni ofis
- `PUT /api/branches/{id}` - Ofis güncelleme
- `DELETE /api/branches/{id}` - Ofis silme

### Dashboard
- `GET /api/dashboard/stats` - İstatistikler
- `GET /api/dashboard/activities` - Aktivite logları

## 🐳 Docker Komutları

```bash
# Başlat
docker-compose up -d

# Durdur
docker-compose down

# Logları görüntüle
docker-compose logs -f

# Yeniden başlat
docker-compose restart

# Veritabanını sıfırla (yeni mock data yükler)
docker-compose down -v
docker-compose up -d
```

## 📝 Notlar

- Mock data otomatik olarak yüklenir (ilk çalıştırmada)
- Tüm aktiviteler loglanır
- Dashboard gerçek verilerden beslenir
- TypeScript strict mode kapalı (hızlı geliştirme için)

## 👨‍💻 Geliştirici

RTECA Emlak Teknolojileri için geliştirilmiştir.

## 📄 Lisans

Bu proje case study amaçlı geliştirilmiştir.

