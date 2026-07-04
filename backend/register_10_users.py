import sys
import os

# Append the backend directory so we can import app modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal
from app.core.security import hash_password

# Import all models to ensure SQLAlchemy mappers initialize correctly
from app.models.user import User
from app.models.scan_result import ScanResult
from app.models.alert import Alert
from app.models.history import ChatHistory

def register_10():
    db = SessionLocal()
    try:
        users_to_add = [
            {"full_name": "Alice CyberSecurity", "email": "alice@cybershield.ai", "password": "Password123!"},
            {"full_name": "Bob Defender", "email": "bob@cybershield.ai", "password": "Password123!"},
            {"full_name": "Charlie RiskAnalyst", "email": "charlie@cybershield.ai", "password": "Password123!"},
            {"full_name": "David PhishHunter", "email": "david@cybershield.ai", "password": "Password123!"},
            {"full_name": "Emma ShieldGuard", "email": "emma@cybershield.ai", "password": "Password123!"},
            {"full_name": "Frank Cryptographer", "email": "frank@cybershield.ai", "password": "Password123!"},
            {"full_name": "Grace Firewall", "email": "grace@cybershield.ai", "password": "Password123!"},
            {"full_name": "Henry SecOps", "email": "henry@cybershield.ai", "password": "Password123!"},
            {"full_name": "Ivy AIWatcher", "email": "ivy@cybershield.ai", "password": "Password123!"},
            {"full_name": "Jack AdminSecure", "email": "jack@cybershield.ai", "password": "Password123!"},
        ]
        
        registered_count = 0
        for u in users_to_add:
            # Check if user already exists
            existing = db.query(User).filter(User.email == u["email"]).first()
            if not existing:
                new_user = User(
                    full_name=u["full_name"],
                    email=u["email"],
                    hashed_password=hash_password(u["password"]),
                    threat_score=15.0 + (registered_count * 5.0)  # Mix threat scores for demo
                )
                db.add(new_user)
                registered_count += 1
        
        if registered_count > 0:
            db.commit()
            print(f"Successfully registered {registered_count} new accounts!")
        else:
            print("All 10 demo accounts already exist in the database.")
            
        # Query and display all users
        all_users = db.query(User).all()
        print("\nDATABASE 'users' TABLE RECORDS:")
        print("-" * 100)
        print(f"{'ID':<5} | {'Full Name':<25} | {'Email Address':<25} | {'Threat Score':<12} | {'Active':<8}")
        print("-" * 100)
        for u in all_users:
            print(f"{u.id:<5} | {u.full_name:<25} | {u.email:<25} | {u.threat_score:<12.1f} | {str(u.is_active):<8}")
        print("-" * 100)
            
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    register_10()
