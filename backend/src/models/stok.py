from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Stok(Base):
    __tablename__ = "stok"

    id = Column(Integer, primary_key=True)
    nama_barang = Column(String(100))  # gabah_basah, gabah_kering, beras, katul, broken, menir, PK
    jumlah_kg = Column(Float)
    tanggal_update = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<Stok(id={self.id}, nama_barang='{self.nama_barang}', jumlah_kg={self.jumlah_kg})>"
