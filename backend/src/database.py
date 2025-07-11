from sqlalchemy.orm import Session
from config.db import SessionLocal
from contextlib import contextmanager

@contextmanager
def get_db():
    """
    Menyediakan sesi database dan memastikan sesi ditutup setelah digunakan.
    """
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()
