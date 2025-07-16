import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertSupplierSchema,
  insertCustomerSchema,
  insertPembelianSchema,
  insertPengeringanSchema,
  insertProduksiSchema,
  insertPenjualanSchema,
  insertPengeluaranSchema,
  insertStokSchema,
  insertLogStokSchema,
  insertSettingsSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Dashboard routes
  app.get("/api/dashboard/metrics", async (req, res) => {
    try {
      const metrics = await storage.getDashboardMetrics();
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching dashboard metrics:", error);
      res.status(500).json({ message: "Failed to fetch dashboard metrics" });
    }
  });

  app.get("/api/dashboard/transactions", async (req, res) => {
    try {
      const [pembelian, penjualan, pengeluaran] = await Promise.all([
        storage.getAllPembelian(),
        storage.getAllPenjualan(),
        storage.getAllPengeluaran(),
      ]);

      // Format all transactions with consistent structure
      const allTransactions = [
        ...pembelian.map(p => ({
          id: `pembelian-${p.id}`,
          type: 'pembelian',
          description: `Pembelian ${p.jenisBarang || p.jenisGabah}`,
          amount: parseFloat(p.jumlah.toString()),
          value: parseFloat(p.totalHarga.toString()),
          date: p.createdAt || new Date()
        })),
        ...penjualan.map(p => ({
          id: `penjualan-${p.id}`,
          type: 'penjualan',
          description: `Penjualan ${p.jenisBarang || p.jenisBeras}`,
          amount: parseFloat(p.jumlah.toString()),
          value: parseFloat(p.totalHarga.toString()),
          date: p.createdAt || new Date()
        })),
        ...pengeluaran.map(p => ({
          id: `pengeluaran-${p.id}`,
          type: 'pengeluaran',
          description: p.deskripsi || p.kategori,
          amount: 0,
          value: parseFloat(p.jumlah.toString()),
          date: p.createdAt || new Date()
        }))
      ];

      // Sort by date (newest first) and limit to 20 most recent
      const sortedTransactions = allTransactions
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 20);

      res.json(sortedTransactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  // Supplier routes
  app.get("/api/suppliers", async (req, res) => {
    try {
      const suppliers = await storage.getAllSuppliers();
      
      // Add sample data if empty
      if (suppliers.length === 0) {
        const sampleSuppliers = [
          {
            name: "Toko Tani Sejahtera",
            address: "Jl. Sawah No. 123, Desa Padi",
            phone: "081234567890"
          },
          {
            name: "CV. Gabah Makmur", 
            address: "Jl. Pertanian No. 456, Kec. Subur",
            phone: "081234567891"
          }
        ];
        
        for (const supplier of sampleSuppliers) {
          await storage.createSupplier(supplier);
        }
        
        const newSuppliers = await storage.getAllSuppliers();
        res.json(newSuppliers);
      } else {
        res.json(suppliers);
      }
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      res.status(500).json({ message: "Failed to fetch suppliers" });
    }
  });

  app.get("/api/suppliers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const supplier = await storage.getSupplier(id);
      if (!supplier) {
        return res.status(404).json({ message: "Supplier not found" });
      }
      res.json(supplier);
    } catch (error) {
      console.error("Error fetching supplier:", error);
      res.status(500).json({ message: "Failed to fetch supplier" });
    }
  });

  app.post("/api/suppliers", async (req, res) => {
    try {
      const validatedData = insertSupplierSchema.parse(req.body);
      const supplier = await storage.createSupplier(validatedData);
      res.status(201).json(supplier);
    } catch (error) {
      console.error("Error creating supplier:", error);
      res.status(400).json({ message: "Invalid supplier data" });
    }
  });

  app.put("/api/suppliers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertSupplierSchema.partial().parse(req.body);
      const supplier = await storage.updateSupplier(id, validatedData);
      res.json(supplier);
    } catch (error) {
      console.error("Error updating supplier:", error);
      res.status(400).json({ message: "Invalid supplier data" });
    }
  });

  app.delete("/api/suppliers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteSupplier(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting supplier:", error);
      res.status(500).json({ message: "Failed to delete supplier" });
    }
  });

  // Customer routes
  app.get("/api/customers", async (req, res) => {
    try {
      const customers = await storage.getAllCustomers();
      
      // Add sample data if empty
      if (customers.length === 0) {
        const sampleCustomers = [
          {
            name: "Warung Pak Budi",
            address: "Jl. Pasar No. 789, Kelurahan Ramai",
            phone: "081234567892"
          },
          {
            name: "Toko Beras Sari",
            address: "Jl. Beras No. 101, Kota Sejahtera",
            phone: "081234567893"
          }
        ];
        
        for (const customer of sampleCustomers) {
          await storage.createCustomer(customer);
        }
        
        const newCustomers = await storage.getAllCustomers();
        res.json(newCustomers);
      } else {
        res.json(customers);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
      res.status(500).json({ message: "Failed to fetch customers" });
    }
  });

  app.post("/api/customers", async (req, res) => {
    try {
      const validatedData = insertCustomerSchema.parse(req.body);
      const customer = await storage.createCustomer(validatedData);
      res.status(201).json(customer);
    } catch (error) {
      console.error("Error creating customer:", error);
      res.status(400).json({ message: "Invalid customer data" });
    }
  });

  // Pembelian routes
  app.get("/api/pembelian", async (req, res) => {
    try {
      const pembelian = await storage.getAllPembelian();
      
      // Add sample data if empty
      if (pembelian.length === 0) {
        const suppliers = await storage.getAllSuppliers();
        if (suppliers.length > 0) {
          const samplePembelian = [
            {
              supplierId: suppliers[0].id,
              tanggal: new Date('2024-01-15'),
              jenisGabah: "Gabah Premium",
              jenisBarang: "gabah",
              jumlah: "1000",
              hargaPerKg: "8000",
              totalHarga: "8000000",
              kadarAir: "12",
              kualitas: "A",
              status: "completed",
              metodePembayaran: "cash",
              catatan: "Kualitas bagus, pengiriman tepat waktu"
            },
            {
              supplierId: suppliers[1]?.id || suppliers[0].id,
              tanggal: new Date('2024-01-14'),
              jenisGabah: "Gabah Medium",
              jenisBarang: "gabah",
              jumlah: "500",
              hargaPerKg: "7500",
              totalHarga: "3750000",
              kadarAir: "14",
              kualitas: "B",
              status: "completed",
              metodePembayaran: "transfer",
              catatan: "Standar"
            }
          ];
          
          for (const item of samplePembelian) {
            await storage.createPembelian(item);
          }
        }
        
        const newPembelian = await storage.getAllPembelian();
        res.json(newPembelian);
      } else {
        res.json(pembelian);
      }
    } catch (error) {
      console.error("Error fetching pembelian:", error);
      res.status(500).json({ message: "Failed to fetch pembelian" });
    }
  });

  app.post("/api/pembelian", async (req, res) => {
    try {
      // PRIORITAS AUDIT - FIXED: Validasi dengan schema yang ketat
      const validatedData = insertPembelianSchema.parse(req.body);
      const pembelian = await storage.createPembelian(validatedData);
      res.status(201).json(pembelian);
    } catch (error) {
      console.error("Error creating pembelian:", error);
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(400).json({ message: "Invalid pembelian data" });
      }
    }
  });

  app.put("/api/pembelian/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertPembelianSchema.partial().parse(req.body);
      const pembelian = await storage.updatePembelian(id, validatedData);
      res.json(pembelian);
    } catch (error) {
      console.error("Error updating pembelian:", error);
      res.status(400).json({ message: "Invalid pembelian data" });
    }
  });

  app.delete("/api/pembelian/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deletePembelian(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting pembelian:", error);
      res.status(500).json({ message: "Failed to delete pembelian" });
    }
  });

  // Pengeringan routes
  app.get("/api/pengeringan", async (req, res) => {
    try {
      const pengeringan = await storage.getAllPengeringan();
      res.json(pengeringan);
    } catch (error) {
      console.error("Error fetching pengeringan:", error);
      res.status(500).json({ message: "Failed to fetch pengeringan" });
    }
  });

  app.post("/api/pengeringan", async (req, res) => {
    try {
      const validatedData = insertPengeringanSchema.parse(req.body);
      const pengeringan = await storage.createPengeringan(validatedData);
      res.status(201).json(pengeringan);
    } catch (error) {
      console.error("Error creating pengeringan:", error);
      res.status(400).json({ message: "Invalid pengeringan data" });
    }
  });

  // Produksi routes
  app.get("/api/produksi", async (req, res) => {
    try {
      const produksi = await storage.getAllProduksi();
      res.json(produksi);
    } catch (error) {
      console.error("Error fetching produksi:", error);
      res.status(500).json({ message: "Failed to fetch produksi" });
    }
  });

  app.post("/api/produksi", async (req, res) => {
    try {
      // PRIORITAS AUDIT - FIXED: Validasi dengan schema yang ketat + validasi stok
      const validatedData = insertProduksiSchema.parse(req.body);
      const produksi = await storage.createProduksi(validatedData);
      res.status(201).json(produksi);
    } catch (error) {
      console.error("Error creating produksi:", error);
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(400).json({ message: "Invalid produksi data" });
      }
    }
  });

  // Penjualan routes
  app.get("/api/penjualan", async (req, res) => {
    try {
      const penjualan = await storage.getAllPenjualan();
      
      // Add sample data if empty
      if (penjualan.length === 0) {
        const customers = await storage.getAllCustomers();
        if (customers.length > 0) {
          const samplePenjualan = [
            {
              customerId: customers[0].id,
              tanggal: new Date('2024-01-16'),
              jenisBeras: "Beras Premium",
              jenisBarang: "beras",
              jumlah: "50",
              hargaPerKg: "15000",
              totalHarga: "750000",
              status: "completed",
              metodePembayaran: "cash",
              catatan: "Pelanggan reguler"
            },
            {
              customerId: customers[1]?.id || customers[0].id,
              tanggal: new Date('2024-01-15'),
              jenisBeras: "Beras Medium",
              jenisBarang: "beras",
              jumlah: "100",
              hargaPerKg: "12000",
              totalHarga: "1200000",
              status: "completed",
              metodePembayaran: "transfer",
              catatan: "Pesanan besar"
            }
          ];
          
          for (const item of samplePenjualan) {
            await storage.createPenjualan(item);
          }
        }
        
        const newPenjualan = await storage.getAllPenjualan();
        res.json(newPenjualan);
      } else {
        res.json(penjualan);
      }
    } catch (error) {
      console.error("Error fetching penjualan:", error);
      res.status(500).json({ message: "Failed to fetch penjualan" });
    }
  });

  app.post("/api/penjualan", async (req, res) => {
    try {
      // PRIORITAS AUDIT - FIXED: Validasi dengan schema yang ketat + validasi stok
      const validatedData = insertPenjualanSchema.parse(req.body);
      const penjualan = await storage.createPenjualan(validatedData);
      res.status(201).json(penjualan);
    } catch (error) {
      console.error("Error creating penjualan:", error);
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(400).json({ message: "Invalid penjualan data" });
      }
    }
  });

  // Pengeluaran routes
  app.get("/api/pengeluaran", async (req, res) => {
    try {
      const pengeluaran = await storage.getAllPengeluaran();
      res.json(pengeluaran);
    } catch (error) {
      console.error("Error fetching pengeluaran:", error);
      res.status(500).json({ message: "Failed to fetch pengeluaran" });
    }
  });

  app.post("/api/pengeluaran", async (req, res) => {
    try {
      const validatedData = insertPengeluaranSchema.parse(req.body);
      const pengeluaran = await storage.createPengeluaran(validatedData);
      res.status(201).json(pengeluaran);
    } catch (error) {
      console.error("Error creating pengeluaran:", error);
      res.status(400).json({ message: "Invalid pengeluaran data" });
    }
  });

  // Stok routes
  app.get("/api/stok", async (req, res) => {
    try {
      const stok = await storage.getAllStok();
      res.json(stok);
    } catch (error) {
      console.error("Error fetching stok:", error);
      res.status(500).json({ message: "Failed to fetch stok" });
    }
  });

  app.post("/api/stok", async (req, res) => {
    try {
      const validatedData = insertStokSchema.parse(req.body);
      const stok = await storage.createStok(validatedData);
      res.status(201).json(stok);
    } catch (error) {
      console.error("Error creating stok:", error);
      res.status(400).json({ message: "Invalid stok data" });
    }
  });

  // Log Stok routes
  app.get("/api/log-stok", async (req, res) => {
    try {
      const logStok = await storage.getAllLogStok();
      res.json(logStok);
    } catch (error) {
      console.error("Error fetching log stok:", error);
      res.status(500).json({ message: "Failed to fetch log stok" });
    }
  });

  // Settings routes
  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getSettings();
      res.json(settings || null);
    } catch (error) {
      console.error("Error fetching settings:", error);
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  app.post("/api/settings", async (req, res) => {
    try {
      const validatedData = insertSettingsSchema.parse(req.body);
      const settings = await storage.createSettings(validatedData);
      res.status(201).json(settings);
    } catch (error) {
      console.error("Error creating settings:", error);
      res.status(400).json({ message: "Invalid settings data" });
    }
  });

  app.put("/api/settings/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertSettingsSchema.partial().parse(req.body);
      const settings = await storage.updateSettings(id, validatedData);
      res.json(settings);
    } catch (error) {
      console.error("Error updating settings:", error);
      res.status(400).json({ message: "Invalid settings data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
