# RTECA Emlak Teknolojileri - Franchise Yönetim Sistemi

Full-stack Franchise ve Şube Yönetim Modülü


## 🔧 Kurulum ve Çalıştırma

### 1. Projeyi Klonlayın
```bash
git clone https://github.com/talha-eren/RTECA_Emlak_Teknolojileri.git
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

### Not 
**Resimler net değilse İmages klasoründen detaylı bakabilirsiniz yada projeyi çalıştırarak test edebilirsiniz**

*Dashboard ekranı aşşağıdaki resimdeki gibi görünür.Uygulamamızda yaptığınız tüm değişiklikler buradan takip edebilirsiniz tablo ve grafiklerden yaralanabilirsiniz*
<p align="center">
  <img src="İmages/Dashboard.png" width="600">
</p>

*Franchise Detayları ekranı aşşağıdaki resimdeki gibi görünür.Bu ekrandan Franchise bilgilerinizi düzenleyebilirsiniz. Ayrıca Pdf ve Excel olarak kayıt edebilirsiniz ve yazdırabilirsiniz*

<p align="center">
  <img src="İmages/Franchise Detayları.png" width="600">
</p>

*Ofis Yönetimi ekranı aşşağıdaki resimdeki gibi görünür.Bu ekrandan Ofislerinizi görebilirsiniz,ofislerinizi ekleyebilirsiniz ve düzenleyebilirsiniz. Ayrıca Pdf ve Excel olarak kayıt edebilirsiniz ve yazdırabilirsiniz.Sadece herhangi bir ofisinizin bilgilerinide yazdırabilirsiniz*

<p align="center">
  <img src="İmages/Ofis Yönetimi.png" width="600">
</p>

*Profil ekranı aşşağıdaki resimdeki gibi görünür.Bu ekrandan Profilinizi görebilirsiniz bilgilerinizi değiştirebilirsiniz.*

<p align="center">
  <img src="İmages/Profil.png" width="600">
</p>

*Giriş ekranı aşşağıdaki resimdeki gibi görünür.Bu ekrandan giriş yapabilirsiniz*
- **Email:** admin@jokersoft.com
- **Şifre:** admin123

<p align="center">
  <img src="İmages/Giriş Ekranı.png" width="600">
</p>

*Kayıt ekranı aşşağıdaki resimdeki gibi görünür.Bu ekrandan kayıt olabilirsiniz.*

<p align="center">
  <img src="İmages/Kayıt Ekranı.png" width="600">
</p>

## EK ÖZELLİK
*Yardımcı Asistan aşşağıdaki resimdeki gibi görünür.Bu ekran uygulamaya eklenmiş ek özelliktir. Buradan RTECA Asistanı sizlere yönlendirme yapar*

<p align="center">
  <img src="İmages/Yardımcı Asistan.png" width="600">
</p>



## 📊 Mock Data

Sistem ilk çalıştırıldığında otomatik olarak şunları yükler:
- 1 Admin kullanıcı
- 2 Franchise (İstanbul, Ankara)
- 6 Ofis (rastgele danışman sayıları ile)


Projemize giriş yaptıktan sonra 


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

## 📄 Lisans

Bu proje case study amaçlı geliştirilmiştir.

## 👨‍💻 Geliştirici : Talha Eren Bilikci

