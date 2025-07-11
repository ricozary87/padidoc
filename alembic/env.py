from logging.config import fileConfig
from sqlalchemy import engine_from_config, create_engine
from sqlalchemy import pool
import os
import sys
from alembic import context

# Tambahkan path ke folder utama proyek Anda
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Impor DATABASE_URL dan Base dari file konfigurasi db.py Anda
from backend.src.config.db import DATABASE_URL, Base

# Impor semua model Anda agar Alembic dapat melihatnya
from backend.src.models.pembelian import *
from backend.src.models.produksi import *
from backend.src.models.penjualan import *
from backend.src.models.pengeluaran import *
from backend.src.models.stok import *
from backend.src.models.pengeringan import *
from backend.src.models.log_stok import *

# Ini adalah objek konfigurasi Alembic
config = context.config

# Interpretasi file konfigurasi untuk Python logging
fileConfig(config.config_file_name)

# Tentukan metadata target untuk migrasi
target_metadata = Base.metadata

def run_migrations_offline():
    """Jalankan migrasi dalam mode 'offline'."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online():
    """Jalankan migrasi dalam mode 'online'."""
    connectable = create_engine(DATABASE_URL)
    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata
        )
        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()

