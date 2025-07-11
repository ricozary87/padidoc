from sqlalchemy import Column, Integer, String, Float, Date, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class Penjualan(Base):
    __tablename__ = "penjualan"

    id = Column(Integer, primary_key=True)
    tanggal = Column(Date)
    produk = Column(String(50))  # beras, menir, katul, broken, PK
    jumlah_kg = Column(Float)
    harga_per_kg = Column(Float)
    # Kolom 'total' dihapus untuk menghindari data redundan
    pembeli = Column(String(100))
    status_pembayaran = Column(String(50), default='Lunas')  # Lunas / Belum
    tanggal_jatuh_tempo = Column(Date, nullable=True)
    tanggal_pelunasan = Column(Date, nullable=True)
    catatan = Column(Text)

    def __repr__(self):
        return f"<Penjualan(id={self.id}, tanggal='{self.tanggal}', produk='{self.produk}')>"

    @property
    def total_harga(self):
        """Menghitung total harga secara otomatis."""
        if self.jumlah_kg is not None and self.harga_per_kg is not None:
            return self.jumlah_kg * self.harga_per_kg
        return 0
