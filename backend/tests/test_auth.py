import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.core.database import Base, get_db

# Setup in-memory SQLite database for testing
DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# Override database dependency in FastAPI
def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_database():
    """Create tables on test initialization and drop them after tests complete."""
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


def test_health_check():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "service": "AI CyberShield API", "version": "1.0.0"}


def test_user_registration():
    # Test valid registration
    response = client.post(
        "/api/v1/auth/register",
        json={
            "full_name": "Test User",
            "email": "test@cybershield.ai",
            "password": "supersecurepassword123",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "test@cybershield.ai"
    assert data["full_name"] == "Test User"
    assert "id" in data

    # Test registering duplicate email
    response = client.post(
        "/api/v1/auth/register",
        json={
            "full_name": "Another User",
            "email": "test@cybershield.ai",
            "password": "anotherpassword321",
        },
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Email already registered"


def test_user_login():
    # Register user first
    client.post(
        "/api/v1/auth/register",
        json={
            "full_name": "Login User",
            "email": "login@cybershield.ai",
            "password": "password123",
        },
    )

    # Test login with correct credentials
    response = client.post(
        "/api/v1/auth/login",
        data={"username": "login@cybershield.ai", "password": "password123"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == "login@cybershield.ai"

    # Test login with incorrect credentials
    response = client.post(
        "/api/v1/auth/login",
        data={"username": "login@cybershield.ai", "password": "wrongpassword"},
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid email or password"
