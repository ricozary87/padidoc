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

  // Supplier routes
  app.get("/api/suppliers", async (req, res) => {
    try {
      const suppliers = await storage.getAllSuppliers();
      res.json(suppliers);
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
      res.json(customers);
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
      res.json(pembelian);
    } catch (error) {
      console.error("Error fetching pembelian:", error);
      res.status(500).json({ message: "Failed to fetch pembelian" });
    }
  });

  app.post("/api/pembelian", async (req, res) => {
    try {
      const validatedData = insertPembelianSchema.parse(req.body);
      const pembelian = await storage.createPembelian(validatedData);
      res.status(201).json(pembelian);
    } catch (error) {
      console.error("Error creating pembelian:", error);
      res.status(400).json({ message: "Invalid pembelian data" });
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
      const validatedData = insertProduksiSchema.parse(req.body);
      const produksi = await storage.createProduksi(validatedData);
      res.status(201).json(produksi);
    } catch (error) {
      console.error("Error creating produksi:", error);
      res.status(400).json({ message: "Invalid produksi data" });
    }
  });

  // Penjualan routes
  app.get("/api/penjualan", async (req, res) => {
    try {
      const penjualan = await storage.getAllPenjualan();
      res.json(penjualan);
    } catch (error) {
      console.error("Error fetching penjualan:", error);
      res.status(500).json({ message: "Failed to fetch penjualan" });
    }
  });

  app.post("/api/penjualan", async (req, res) => {
    try {
      const validatedData = insertPenjualanSchema.parse(req.body);
      const penjualan = await storage.createPenjualan(validatedData);
      res.status(201).json(penjualan);
    } catch (error) {
      console.error("Error creating penjualan:", error);
      res.status(400).json({ message: "Invalid penjualan data" });
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

  const httpServer = createServer(app);
  return httpServer;
}
