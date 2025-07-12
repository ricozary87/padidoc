from sqlalchemy import Column, Integer, String, Float, Date, Text
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Pembelian(Base):
    __tablename__ = "pembelian_produk"

    id = Column(Integer, primary_key=True)
    tanggal = Column(Date)
    nama_supplier = Column(String(100)) # Opsional: Tambahkan batasan panjang string
    jenis_produk = Column(String(50))   # gabah / PK / beras / katul
    status = Column(String(50))        # basah / kering / PK
    berat_kg = Column(Float)
    total_harga = Column(Float)
    harga_per_kg = Column(Float)
    
    catatan = Column(Text)

    def __repr__(self):
        return f"<Pembelian(id={self.id}, tanggal='{self.tanggal}', total_harga='{self.total_harga}')>"


