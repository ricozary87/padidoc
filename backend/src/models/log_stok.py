from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class LogStok(Base):
    """
    Model untuk menyimpan log semua perubahan pada stok barang.
    """
    __tablename__ = "log_stok"

    id = Column(Integer, primary_key=True)
    tanggal = Column(DateTime, default=datetime.utcnow)
    nama_barang = Column(String(100))
    jenis_transaksi = Column(String(20))  # masuk / keluar
    jumlah = Column(Float)
    sumber = Column(String(50))           # pembelian / produksi / penjualan / pengeringan
    referensi_id = Column(Integer)        # id dari transaksi aslinya
    catatan = Column(Text)

    def __repr__(self):
        return f"<LogStok(id={self.id}, tanggal='{self.tanggal}', jenis_transaksi='{self.jenis_transaksi}', jumlah={self.jumlah})>"

