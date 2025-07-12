from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.src.models.pembelian import Pembelian
from backend.src.schemas.pembelian_schema import PembelianCreate, PembelianOut
from backend.src.database import get_db

pembelian_router = APIRouter()

@pembelian_router.post("/pembelian", response_model=PembelianOut, status_code=status.HTTP_201_CREATED)
def buat_pembelian(data: PembelianCreate, db: Session = Depends(get_db)):
    try:
        # Hitung total_harga sebelum membuat objek Pembelian
        total_harga_dihitung = data.berat_kg * data.harga_per_kg

        pembelian_db = Pembelian(
            tanggal=data.tanggal,
            nama_supplier=data.nama_supplier,
            jenis_produk=data.jenis_produk,
            status=data.status,
            berat_kg=data.berat_kg,
            harga_per_kg=data.harga_per_kg,
            # Gunakan nilai yang dihitung
            total_harga=total_harga_dihitung,
            catatan=data.catatan
        )

        db.add(pembelian_db)
        db.commit()
        db.refresh(pembelian_db)

        return pembelian_db
    except Exception as e:
        # Rollback jika terjadi error
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Terjadi kesalahan saat menyimpan data: {e}")

@pembelian_router.get("/pembelian", response_model=list[PembelianOut])
def get_pembelian(db: Session = Depends(get_db)):
    data = db.query(Pembelian).order_by(Pembelian.tanggal.desc()).all()
    return data
