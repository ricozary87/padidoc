from sqlalchemy import Column, Integer, Float, String, Date, Text, Numeric
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class PengeringanGabah(Base):
    __tablename__ = "pengeringan_gabah"

    id = Column(Integer, primary_key=True)
    tanggal = Column(Date)
    berat_awal = Column(Float)
    berat_setelah_kering = Column(Float)
    biaya = Column(Numeric(10, 2))  # Menggunakan Numeric untuk biaya
    metode = Column(String(50))     # alat sendiri / sewa
    catatan = Column(Text)

    def __repr__(self):
        return f"<PengeringanGabah(id={self.id}, tanggal='{self.tanggal}', berat_awal={self.berat_awal})>"

    @property
    def penyusutan_berat(self):
        """Menghitung penyusutan berat gabah."""
        if self.berat_awal is not None and self.berat_setelah_kering is not None:
            return self.berat_awal - self.berat_setelah_kering
        return 0
