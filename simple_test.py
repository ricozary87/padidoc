#!/usr/bin/env python3
"""
Simple Test Script untuk PadiDoc
Test dasar dengan format yang sesuai dengan frontend
"""

import requests
import json
from datetime import datetime

def test_basic_workflow():
    """Test basic workflow: pembelian -> produksi -> penjualan"""
    base_url = "http://localhost:5000"
    
    print("=== Testing Basic PadiDoc Workflow ===")
    
    # 1. Test pembelian (menambah stok gabah)
    print("\n1. Testing Pembelian...")
    pembelian_data = {
        "supplierId": 1,  # Asumsi supplier ID 1 ada
        "tanggal": "2025-07-16",
        "jenisGabah": "Gabah Kering Premium",
        "jenisBarang": "gabah",
        "jumlah": "1000",
        "hargaPerKg": "8000",
        "totalHarga": "8000000",
        "kadarAir": "14",
        "kualitas": "A",
        "status": "completed",
        "metodePembayaran": "cash",
        "catatan": "Test pembelian untuk validasi stok"
    }
    
    try:
        response = requests.post(f"{base_url}/api/pembelian", json=pembelian_data)
        if response.status_code == 201:
            print("✓ Pembelian berhasil - Stok gabah bertambah")
        else:
            print(f"✗ Pembelian gagal: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"✗ Error pembelian: {e}")
    
    # 2. Test produksi (konversi gabah ke beras)
    print("\n2. Testing Produksi...")
    produksi_data = {
        "tanggal": "2025-07-16",
        "jenisBerasProduced": "Beras Premium",
        "jumlahGabahInput": "800",
        "jumlahBerasOutput": "480",
        "jumlahKatul": "80",
        "jumlahMenir": "40",
        "jumlahSekam": "120",
        "rendemen": "60.00",
        "status": "completed",
        "catatan": "Test produksi untuk validasi stok"
    }
    
    try:
        response = requests.post(f"{base_url}/api/produksi", json=produksi_data)
        if response.status_code == 201:
            print("✓ Produksi berhasil - Stok gabah berkurang, stok beras bertambah")
        else:
            print(f"✗ Produksi gagal: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"✗ Error produksi: {e}")
    
    # 3. Test penjualan (mengurangi stok beras)
    print("\n3. Testing Penjualan...")
    penjualan_data = {
        "customerId": 1,  # Asumsi customer ID 1 ada
        "tanggal": "2025-07-16",
        "jenisBeras": "Beras Premium",
        "jenisBarang": "beras",
        "jumlah": "300",
        "hargaPerKg": "15000",
        "totalHarga": "4500000",
        "status": "completed",
        "metodePembayaran": "cash",
        "catatan": "Test penjualan untuk validasi stok"
    }
    
    try:
        response = requests.post(f"{base_url}/api/penjualan", json=penjualan_data)
        if response.status_code == 201:
            print("✓ Penjualan berhasil - Stok beras berkurang")
        else:
            print(f"✗ Penjualan gagal: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"✗ Error penjualan: {e}")
    
    # 4. Test overselling (harus gagal)
    print("\n4. Testing Overselling Protection...")
    oversell_data = {
        "customerId": 1,
        "tanggal": "2025-07-16",
        "jenisBeras": "Beras Test Oversell",
        "jenisBarang": "beras",
        "jumlah": "50000",  # 50 ton - harus melebihi stok
        "hargaPerKg": "15000",
        "totalHarga": "750000000",
        "status": "completed",
        "metodePembayaran": "cash",
        "catatan": "Test overselling protection"
    }
    
    try:
        response = requests.post(f"{base_url}/api/penjualan", json=oversell_data)
        if response.status_code == 400:
            print("✓ Overselling berhasil dicegah - Validasi stok bekerja")
        else:
            print(f"✗ PERINGATAN: Overselling tidak dicegah! Status: {response.status_code}")
    except Exception as e:
        print(f"✗ Error overselling test: {e}")
    
    # 5. Cek stok akhir
    print("\n5. Checking Final Stock...")
    try:
        response = requests.get(f"{base_url}/api/stok")
        if response.status_code == 200:
            stocks = response.json()
            print("Current stock levels:")
            for stock in stocks:
                print(f"  - {stock['jenisItem']}: {stock['jumlah']} {stock['satuan']}")
        else:
            print(f"✗ Gagal mengambil data stok: {response.status_code}")
    except Exception as e:
        print(f"✗ Error checking stock: {e}")
    
    # 6. Dashboard metrics
    print("\n6. Dashboard Metrics...")
    try:
        response = requests.get(f"{base_url}/api/dashboard/metrics")
        if response.status_code == 200:
            metrics = response.json()
            print("Dashboard metrics:")
            print(f"  - Today's Purchases: {metrics.get('todayPurchases', 0)}")
            print(f"  - Today's Production: {metrics.get('todayProduction', 0)}")
            print(f"  - Today's Sales: {metrics.get('todaySales', 0)}")
            print(f"  - Rice Stock: {metrics.get('stockRice', 0)} kg")
            print(f"  - Gabah Stock: {metrics.get('stockGabah', 0)} kg")
        else:
            print(f"✗ Gagal mengambil dashboard metrics: {response.status_code}")
    except Exception as e:
        print(f"✗ Error dashboard metrics: {e}")
    
    print("\n=== Test Completed ===")

if __name__ == "__main__":
    # Cek server
    try:
        response = requests.get("http://localhost:5000/api/dashboard/metrics")
        if response.status_code == 200:
            test_basic_workflow()
        else:
            print(f"Server error: {response.status_code}")
    except requests.exceptions.ConnectionError:
        print("Error: Cannot connect to server. Make sure the application is running on localhost:5000")
    except Exception as e:
        print(f"Error: {e}")