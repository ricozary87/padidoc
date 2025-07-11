from sqlalchemy import Column, Integer, String, Float, Date, Text
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Produksi(Base):
    __tablename__ = "produksi"

    id = Column(Integer, primary_key=True)
    tanggal = Column(Date)
    jenis_padi = Column(String(50))
    sumber = Column(String(50)) # gabah_kering / PK
    jumlah_bahan_digiling = Column(Float)
    hasil_beras = Column(Float)
    hasil_menir = Column(Float)
    hasil_dedak = Column(Float)
    hasil_broken = Column(Float)
    catatan = Column(Text)

    def __repr__(self):
        return f"<Produksi(id={self.id}, tanggal='{self.tanggal}', bahan_digiling={self.jumlah_bahan_digiling})>"

