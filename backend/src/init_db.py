from config.db import Base, engine
from models.pembelian import Pembelian

Base.metadata.create_all(bind=engine)
print("✅ Tabel pembelian berhasil dibuat.")
