"""
Mock data seeder script for Franchise Management System
This script populates the database with sample data for testing purposes.
"""

import sys
import os
import random
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import SessionLocal, engine, Base
from app.models import User, Franchise, Branch
from app.auth import get_password_hash

def seed_database():
    """Populate database with mock data"""
    
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        print("🌱 Starting database seeding...")
        
        # Check if data already exists
        existing_users = db.query(User).count()
        if existing_users > 0:
            print("⚠️  Database already contains data. Skipping seed.")
            return
        
        # Create Users
        print("👤 Creating users...")
        users = [
            User(
                email="admin@jokersoft.com",
                full_name="Admin User",
                hashed_password=get_password_hash("admin123"),
                is_superuser=True,
                is_active=True
            ),
            User(
                email="demo@jokersoft.com",
                full_name="Demo User",
                hashed_password=get_password_hash("demo123"),
                is_active=True
            ),
        ]
        
        for user in users:
            db.add(user)
        
        db.commit()
        print(f"✅ Created {len(users)} users")
        
        # Create Franchises
        print("🏢 Creating franchises...")
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
            Franchise(
                name="Joker Gayrimenkul - İzmir",
                tax_number="1122334455",
                phone="+90 (232) 555 0000",
                email="izmir@jokergayrimenkul.com",
                address="Alsancak, Kıbrıs Şehitleri Cad. No: 78, İzmir",
                description="İzmir bölge franchise ofisi",
                is_active=True
            ),
            Franchise(
                name="Joker Gayrimenkul - Antalya",
                tax_number="5544332211",
                phone="+90 (242) 555 0000",
                email="antalya@jokergayrimenkul.com",
                address="Lara, Atatürk Cad. No: 90, Antalya",
                description="Antalya bölge franchise ofisi",
                is_active=True
            ),
            Franchise(
                name="Joker Gayrimenkul - Bursa",
                tax_number="6677889900",
                phone="+90 (224) 555 0000",
                email="bursa@jokergayrimenkul.com",
                address="Nilüfer, Fethiye Mah. Uludağ Cad. No: 34, Bursa",
                description="Bursa bölge franchise ofisi",
                is_active=False
            ),
        ]
        
        for franchise in franchises:
            db.add(franchise)
        
        db.commit()
        print(f"✅ Created {len(franchises)} franchises")
        
        # Create Branches
        print("🏪 Creating branches...")
        branches = [
            # Istanbul branches
            Branch(
                franchise_id=1,
                name="Kadıköy Ofisi",
                city="İstanbul",
                phone="+90 (216) 555 0102",
                email="kadikoy@jokergayrimenkul.com",
                address="Moda Mah. Bahariye Cad. No: 123, Kadıköy/İstanbul",
                consultant_count=random.randint(3, 15),
                is_active=True
            ),
            Branch(
                franchise_id=1,
                name="Beşiktaş Ofisi",
                city="İstanbul",
                phone="+90 (212) 555 0103",
                email="besiktas@jokergayrimenkul.com",
                address="Levazım Mah. Zorlu Center, Beşiktaş/İstanbul",
                consultant_count=random.randint(3, 15),
                is_active=True
            ),
            Branch(
                franchise_id=1,
                name="Şişli Ofisi",
                city="İstanbul",
                phone="+90 (212) 555 0104",
                email="sisli@jokergayrimenkul.com",
                address="Meşrutiyet Mah. İstiklal Cad. No: 56, Şişli/İstanbul",
                consultant_count=random.randint(3, 15),
                is_active=True
            ),
            Branch(
                franchise_id=1,
                name="Beylikdüzü Ofisi",
                city="İstanbul",
                phone="+90 (212) 555 0105",
                email="beylikduzu@jokergayrimenkul.com",
                address="Cumhuriyet Mah. Atatürk Bulvarı No: 234, Beylikdüzü/İstanbul",
                consultant_count=random.randint(3, 15),
                is_active=True
            ),
            
            # Ankara branches
            Branch(
                franchise_id=2,
                name="Ataşehir Ofisi",
                city="Ankara",
                phone="+90 (312) 555 0201",
                email="atasehir@jokergayrimenkul.com",
                address="Ataşehir Mah. Reşat Nuri Cad. No: 45, Çankaya/Ankara",
                consultant_count=random.randint(3, 15),
                is_active=True
            ),
            Branch(
                franchise_id=2,
                name="Kızılay Ofisi",
                city="Ankara",
                phone="+90 (312) 555 0202",
                email="kizilay@jokergayrimenkul.com",
                address="Kızılay Mah. Atatürk Bulvarı No: 67, Çankaya/Ankara",
                consultant_count=random.randint(3, 15),
                is_active=True
            ),
            
            # Izmir branches
            Branch(
                franchise_id=3,
                name="Alsancak Ofisi",
                city="İzmir",
                phone="+90 (232) 555 0301",
                email="alsancak@jokergayrimenkul.com",
                address="Alsancak Mah. Kıbrıs Şehitleri Cad. No: 89, Konak/İzmir",
                consultant_count=random.randint(3, 15),
                is_active=True
            ),
            Branch(
                franchise_id=3,
                name="Bornova Ofisi",
                city="İzmir",
                phone="+90 (232) 555 0302",
                email="bornova@jokergayrimenkul.com",
                address="Erzene Mah. Ankara Cad. No: 123, Bornova/İzmir",
                consultant_count=random.randint(3, 15),
                is_active=True
            ),
            
            # Antalya branch
            Branch(
                franchise_id=4,
                name="Lara Ofisi",
                city="Antalya",
                phone="+90 (242) 555 0401",
                email="lara@jokergayrimenkul.com",
                address="Lara Mah. Atatürk Cad. No: 234, Muratpaşa/Antalya",
                consultant_count=random.randint(3, 15),
                is_active=True
            ),
            
            # Bursa branch
            Branch(
                franchise_id=5,
                name="Nilüfer Ofisi",
                city="Bursa",
                phone="+90 (224) 555 0501",
                email="nilufer@jokergayrimenkul.com",
                address="Nilüfer Mah. Uludağ Cad. No: 56, Nilüfer/Bursa",
                consultant_count=random.randint(3, 15),
                is_active=True
            ),
        ]
        
        for branch in branches:
            db.add(branch)
        
        db.commit()
        print(f"✅ Created {len(branches)} branches")
        
        print("\n🎉 Database seeding completed successfully!")
        print("\n📝 Login credentials:")
        print("   Admin: admin@jokersoft.com / admin123")
        print("   Demo:  demo@jokersoft.com / demo123")
        
    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()


