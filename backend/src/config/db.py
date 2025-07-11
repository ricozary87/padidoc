import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from dotenv import load_dotenv

# Muat variabel dari file .env
load_dotenv()

# URL database dari lingkungan, default ke SQLite lokal
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./padidoc.db")

# Setup engine SQLAlchemy
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)

# Buat session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Buat deklarasi Base (wajib untuk Alembic & model)
Base = declarative_base()
