from sqlalchemy import Column, Integer, String, Float, Date, Text, Numeric
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Pengeluaran(Base):
    __tablename__ = "pengeluaran"

    id = Column(Integer, primary_key=True)
    tanggal = Column(Date)
    kategori = Column(String(100)) # solar, listrik, gaji, alat, sewa dryer, dll
    jumlah = Column(Numeric(10, 2)) # Menggunakan Numeric untuk menghindari isu presisi
    keterangan = Column(Text)

    def __repr__(self):
        return f"<Pengeluaran(id={self.id}, tanggal='{self.tanggal}', kategori='{self.kategori}', jumlah={self.jumlah})>"

