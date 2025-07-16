#!/usr/bin/env python3
"""
Test Seed Script untuk PadiDoc
Simulasi masal untuk menguji sistem stok otomatis dan validasi
"""

import requests
import json
from datetime import datetime, timedelta
import random
import time
from typing import Dict, List, Any

class PadiDocTester:
    def __init__(self, base_url: str = "http://localhost:5000"):
        self.base_url = base_url
        self.session = requests.Session()
        self.suppliers = []
        self.customers = []
        self.pembelian_ids = []
        self.penjualan_ids = []
        self.produksi_ids = []
        
    def log(self, message: str, level: str = "INFO"):
        """Log message dengan timestamp"""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        print(f"[{timestamp}] {level}: {message}")
        
    def make_request(self, method: str, endpoint: str, data: Dict = None) -> Dict:
        """Membuat HTTP request ke API"""
        url = f"{self.base_url}{endpoint}"
        
        try:
            if method.upper() == "GET":
                response = self.session.get(url)
            elif method.upper() == "POST":
                response = self.session.post(url, json=data)
            elif method.upper() == "PUT":
                response = self.session.put(url, json=data)
            elif method.upper() == "DELETE":
                response = self.session.delete(url)
            else:
                raise ValueError(f"Method {method} not supported")
                
            response.raise_for_status()
            return response.json() if response.content else {}
            
        except requests.exceptions.RequestException as e:
            self.log(f"Request error: {e}", "ERROR")
            if hasattr(e, 'response') and e.response is not None:
                self.log(f"Response: {e.response.text}", "ERROR")
            return {}
    
    def create_sample_suppliers(self) -> List[Dict]:
        """Membuat sample supplier"""
        self.log("Creating sample suppliers...")
        
        suppliers_data = [
            {
                "name": "CV Tani Makmur",
                "address": "Jl. Sawah Raya No. 123, Subang",
                "phone": "081234567890",
                "contactPerson": "Budi Santoso"
            },
            {
                "name": "UD Gabah Sejahtera",
                "address": "Jl. Pertanian No. 456, Karawang",
                "phone": "081234567891",
                "contactPerson": "Siti Rahayu"
            },
            {
                "name": "PT Hasil Panen",
                "address": "Jl. Raya Indramayu No. 789, Indramayu",
                "phone": "081234567892",
                "contactPerson": "Ahmad Yusuf"
            }
        ]
        
        for supplier_data in suppliers_data:
            result = self.make_request("POST", "/api/suppliers", supplier_data)
            if result:
                self.suppliers.append(result)
                self.log(f"Created supplier: {supplier_data['name']}")
        
        return self.suppliers
    
    def create_sample_customers(self) -> List[Dict]:
        """Membuat sample customer"""
        self.log("Creating sample customers...")
        
        customers_data = [
            {
                "name": "Warung Nasi Pak Umar",
                "address": "Jl. Pasar Baru No. 101, Jakarta",
                "phone": "081234567893"
            },
            {
                "name": "Toko Beras Berkah",
                "address": "Jl. Raya Bogor No. 202, Bogor",
                "phone": "081234567894"
            },
            {
                "name": "Distributor Pangan Jaya",
                "address": "Jl. Industri No. 303, Bekasi",
                "phone": "081234567895"
            }
        ]
        
        for customer_data in customers_data:
            result = self.make_request("POST", "/api/customers", customer_data)
            if result:
                self.customers.append(result)
                self.log(f"Created customer: {customer_data['name']}")
        
        return self.customers
    
    def create_mass_pembelian(self, count: int = 10) -> List[Dict]:
        """Membuat pembelian masal untuk menambah stok"""
        self.log(f"Creating {count} mass purchases...")
        
        if not self.suppliers:
            self.log("No suppliers found. Creating suppliers first.", "WARNING")
            self.create_sample_suppliers()
        
        pembelian_list = []
        jenis_gabah_options = ["Gabah Kering Premium", "Gabah Basah", "Gabah Super", "Gabah Lokal"]
        
        for i in range(count):
            # Variasi data pembelian
            supplier = random.choice(self.suppliers)
            jumlah = random.randint(500, 2000)  # 500-2000 kg
            harga_per_kg = random.randint(7000, 12000)  # 7000-12000 per kg
            total_harga = jumlah * harga_per_kg
            
            # Tanggal dalam rentang 30 hari terakhir
            days_ago = random.randint(0, 30)
            tanggal = (datetime.now() - timedelta(days=days_ago)).isoformat()
            
            pembelian_data = {
                "supplierId": supplier["id"],
                "tanggal": tanggal,
                "jenisGabah": random.choice(jenis_gabah_options),
                "jenisBarang": "gabah",
                "jumlah": str(jumlah),
                "hargaPerKg": str(harga_per_kg),
                "totalHarga": str(total_harga),
                "kadarAir": str(random.randint(12, 16)),
                "kualitas": random.choice(["A", "B", "C"]),
                "status": "completed",
                "metodePembayaran": random.choice(["cash", "transfer"]),
                "catatan": f"Pembelian batch {i+1} - Testing"
            }
            
            result = self.make_request("POST", "/api/pembelian", pembelian_data)
            if result:
                pembelian_list.append(result)
                self.pembelian_ids.append(result["id"])
                self.log(f"Created pembelian {i+1}: {jumlah} kg gabah from {supplier['name']}")
            else:
                self.log(f"Failed to create pembelian {i+1}", "ERROR")
                
            time.sleep(0.1)  # Prevent overwhelming the server
        
        return pembelian_list
    
    def create_mass_produksi(self, count: int = 5) -> List[Dict]:
        """Membuat produksi masal untuk mengkonversi gabah menjadi beras"""
        self.log(f"Creating {count} mass production...")
        
        produksi_list = []
        
        for i in range(count):
            # Input gabah untuk produksi
            gabah_input = random.randint(800, 1200)  # 800-1200 kg
            
            # Rendemen rata-rata 60-70%
            rendemen = random.uniform(60, 70)
            beras_output = int(gabah_input * rendemen / 100)
            
            # Produk sampingan
            katul_output = int(gabah_input * 0.10)  # 10% katul
            menir_output = int(gabah_input * 0.05)  # 5% menir
            sekam_output = int(gabah_input * 0.15)  # 15% sekam
            
            # Tanggal produksi
            days_ago = random.randint(0, 15)
            tanggal = (datetime.now() - timedelta(days=days_ago)).isoformat()
            
            produksi_data = {
                "tanggal": tanggal,
                "jenisBerasProduced": random.choice(["Beras Premium", "Beras Medium", "Beras Lokal"]),
                "jumlahGabahInput": str(gabah_input),
                "jumlahBerasOutput": str(beras_output),
                "jumlahKatul": str(katul_output),
                "jumlahMenir": str(menir_output),
                "jumlahSekam": str(sekam_output),
                "rendemen": str(round(rendemen, 2)),
                "status": "completed",
                "catatan": f"Produksi batch {i+1} - Testing"
            }
            
            result = self.make_request("POST", "/api/produksi", produksi_data)
            if result:
                produksi_list.append(result)
                self.produksi_ids.append(result["id"])
                self.log(f"Created produksi {i+1}: {gabah_input} kg gabah → {beras_output} kg beras")
            else:
                self.log(f"Failed to create produksi {i+1}", "ERROR")
                
            time.sleep(0.1)
        
        return produksi_list
    
    def create_mass_penjualan(self, count: int = 8) -> List[Dict]:
        """Membuat penjualan masal untuk menguji validasi stok"""
        self.log(f"Creating {count} mass sales...")
        
        if not self.customers:
            self.log("No customers found. Creating customers first.", "WARNING")
            self.create_sample_customers()
        
        penjualan_list = []
        jenis_beras_options = ["Beras Premium", "Beras Medium", "Beras Lokal"]
        
        for i in range(count):
            customer = random.choice(self.customers)
            jumlah = random.randint(200, 800)  # 200-800 kg
            harga_per_kg = random.randint(12000, 18000)  # 12000-18000 per kg
            total_harga = jumlah * harga_per_kg
            
            # Tanggal penjualan
            days_ago = random.randint(0, 10)
            tanggal = (datetime.now() - timedelta(days=days_ago)).isoformat()
            
            penjualan_data = {
                "customerId": customer["id"],
                "tanggal": tanggal,
                "jenisBeras": random.choice(jenis_beras_options),
                "jenisBarang": "beras",
                "jumlah": str(jumlah),
                "hargaPerKg": str(harga_per_kg),
                "totalHarga": str(total_harga),
                "status": "completed",
                "metodePembayaran": random.choice(["cash", "transfer"]),
                "catatan": f"Penjualan batch {i+1} - Testing"
            }
            
            result = self.make_request("POST", "/api/penjualan", penjualan_data)
            if result:
                penjualan_list.append(result)
                self.penjualan_ids.append(result["id"])
                self.log(f"Created penjualan {i+1}: {jumlah} kg beras to {customer['name']}")
            else:
                self.log(f"Failed to create penjualan {i+1} - Possibly insufficient stock", "WARNING")
                
            time.sleep(0.1)
        
        return penjualan_list
    
    def test_overselling_scenario(self):
        """Test skenario overselling untuk memastikan validasi bekerja"""
        self.log("Testing overselling scenario...")
        
        if not self.customers:
            self.create_sample_customers()
        
        # Coba jual beras dalam jumlah besar yang kemungkinan melebihi stok
        oversell_data = {
            "customerId": self.customers[0]["id"],
            "tanggal": datetime.now().isoformat(),
            "jenisBeras": "Beras Test Oversell",
            "jenisBarang": "beras",
            "jumlah": "50000",  # 50 ton - kemungkinan besar melebihi stok
            "hargaPerKg": "15000",
            "totalHarga": "750000000",
            "status": "completed",
            "metodePembayaran": "cash",
            "catatan": "Test overselling protection"
        }
        
        result = self.make_request("POST", "/api/penjualan", oversell_data)
        if result:
            self.log("ALERT: Overselling was allowed - validation failed!", "ERROR")
        else:
            self.log("SUCCESS: Overselling was prevented - validation working!", "SUCCESS")
    
    def check_stock_levels(self):
        """Cek level stok setelah semua transaksi"""
        self.log("Checking stock levels...")
        
        stock_data = self.make_request("GET", "/api/stok")
        if stock_data:
            self.log("Current stock levels:")
            for item in stock_data:
                self.log(f"  - {item['jenisItem']}: {item['jumlah']} {item['satuan']}")
        else:
            self.log("Failed to retrieve stock data", "ERROR")
    
    def get_dashboard_metrics(self):
        """Ambil metrics dashboard untuk validasi"""
        self.log("Getting dashboard metrics...")
        
        metrics = self.make_request("GET", "/api/dashboard/metrics")
        if metrics:
            self.log("Dashboard metrics:")
            self.log(f"  - Today's Purchases: {metrics.get('todayPurchases', 0)}")
            self.log(f"  - Today's Production: {metrics.get('todayProduction', 0)}")
            self.log(f"  - Today's Sales: {metrics.get('todaySales', 0)}")
            self.log(f"  - Rice Stock: {metrics.get('stockRice', 0)} kg")
            self.log(f"  - Gabah Stock: {metrics.get('stockGabah', 0)} kg")
        else:
            self.log("Failed to retrieve dashboard metrics", "ERROR")
    
    def run_full_test(self):
        """Jalankan test lengkap"""
        self.log("=== Starting PadiDoc Mass Testing ===")
        
        try:
            # 1. Setup data dasar
            self.create_sample_suppliers()
            self.create_sample_customers()
            
            # 2. Buat pembelian masal untuk menambah stok
            self.create_mass_pembelian(15)
            
            # 3. Buat produksi untuk mengkonversi gabah ke beras
            self.create_mass_produksi(8)
            
            # 4. Buat penjualan untuk menguji validasi stok
            self.create_mass_penjualan(10)
            
            # 5. Test skenario overselling
            self.test_overselling_scenario()
            
            # 6. Cek level stok akhir
            self.check_stock_levels()
            
            # 7. Ambil metrics dashboard
            self.get_dashboard_metrics()
            
            self.log("=== Mass Testing Completed ===")
            
        except Exception as e:
            self.log(f"Test failed with error: {e}", "ERROR")
            raise

def main():
    """Main function untuk menjalankan test"""
    tester = PadiDocTester()
    
    # Cek apakah server berjalan
    try:
        response = requests.get("http://localhost:5000/api/dashboard/metrics")
        if response.status_code == 200:
            print("Server is running. Starting tests...")
            tester.run_full_test()
        else:
            print(f"Server returned status code: {response.status_code}")
    except requests.exceptions.ConnectionError:
        print("Error: Cannot connect to server. Make sure the application is running on localhost:5000")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()