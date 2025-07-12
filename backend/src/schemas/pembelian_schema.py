from pydantic import BaseModel
from typing import Optional
from datetime import date

class PembelianCreate(BaseModel):
    tanggal: date
    nama_supplier: str
    jenis_produk: str
    status: str
    berat_kg: float
    harga_per_kg: float
    catatan: Optional[str] = None

class PembelianOut(PembelianCreate):
    id: int
    total_harga: float

    class Config:
        from_attributes = True