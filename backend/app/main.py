from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base, SessionLocal
from app.routers import auth, franchises, branches, dashboard
from app.models import User, Franchise, Branch
from app.auth import get_password_hash
import random

# Create database tables
Base.metadata.create_all(bind=engine)

# Auto-seed database with mock data
def seed_database_if_empty():
    """Automatically populate database with mock data if empty"""
    db = SessionLocal()
    try:
        # Check if data already exists
        existing_users = db.query(User).count()
        if existing_users > 0:
            print("✅ Database already contains data")
            return
        
        print("🌱 Auto-seeding database with mock data...")
        
        # Create Users
        users = [
            User(
                email="admin@jokersoft.com",
                full_name="Admin User",
                hashed_password=get_password_hash("admin123"),
                is_superuser=True,
                is_active=True
            ),
        ]
        
        for user in users:
            db.add(user)
        db.commit()
        
        # Create Franchises
        franchises = [
            Franchise(
                name="Joker Gayrimenkul - İstanbul",
                tax_number="1234567890",
                phone="+90 (212) 555 0000",
                email="istanbul@jokergayrimenkul.com",
                address="Merkez Mah. Büyükdere Cad. No: 123, Şişli/İstanbul",
                description="Türkiye'nin tüm gayrimenkul franchise markaları",
                is_active=True
            ),
            Franchise(
                name="Joker Gayrimenkul - Ankara",
                tax_number="0987654321",
                phone="+90 (312) 555 0000",
                email="ankara@jokergayrimenkul.com",
                address="Çankaya, Tunalı Hilmi Cad. No: 45, Ankara",
                description="Ankara bölge franchise ofisi",
                is_active=True
            ),
        ]
        
        for franchise in franchises:
            db.add(franchise)
        db.commit()
        
        # Create Branches
        branches = [
            Branch(franchise_id=1, name="Kadıköy Ofisi", city="İstanbul", phone="+90 (216) 555 0102", 
                   email="kadikoy@jokergayrimenkul.com", consultant_count=random.randint(5, 20), is_active=True),
            Branch(franchise_id=1, name="Beşiktaş Ofisi", city="İstanbul", phone="+90 (212) 555 0103",
                   email="besiktas@jokergayrimenkul.com", consultant_count=random.randint(5, 20), is_active=True),
            Branch(franchise_id=1, name="Şişli Ofisi", city="İstanbul", phone="+90 (212) 555 0104",
                   email="sisli@jokergayrimenkul.com", consultant_count=random.randint(5, 20), is_active=True),
            Branch(franchise_id=1, name="Beylikdüzü Ofisi", city="İstanbul", phone="+90 (212) 555 0105",
                   email="beylikduzu@jokergayrimenkul.com", consultant_count=random.randint(5, 20), is_active=True),
            Branch(franchise_id=2, name="Ataşehir Ofisi", city="Ankara", phone="+90 (312) 555 0201",
                   email="atasehir@jokergayrimenkul.com", consultant_count=random.randint(5, 20), is_active=True),
            Branch(franchise_id=2, name="Kızılay Ofisi", city="Ankara", phone="+90 (312) 555 0202",
                   email="kizilay@jokergayrimenkul.com", consultant_count=random.randint(5, 20), is_active=True),
        ]
        
        for branch in branches:
            db.add(branch)
        db.commit()
        
        print("✅ Database auto-seeded successfully!")
        print("📝 Login: admin@jokersoft.com / admin123")
        
    except Exception as e:
        print(f"❌ Error auto-seeding database: {e}")
        db.rollback()
    finally:
        db.close()

# Run auto-seed on startup
seed_database_if_empty()

app = FastAPI(
    title="Franchise & Branch Management System",
    description="RTECA Case Study - Franchise Management Module",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://frontend:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(franchises.router)
app.include_router(branches.router)
app.include_router(dashboard.router)


@app.get("/")
def read_root():
    return {
        "message": "Franchise & Branch Management API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}


