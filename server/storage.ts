import {
  users,
  suppliers,
  customers,
  pembelian,
  pengeringan,
  produksi,
  penjualan,
  pengeluaran,
  stok,
  logStok,
  type User,
  type InsertUser,
  type Supplier,
  type InsertSupplier,
  type Customer,
  type InsertCustomer,
  type Pembelian,
  type InsertPembelian,
  type Pengeringan,
  type InsertPengeringan,
  type Produksi,
  type InsertProduksi,
  type Penjualan,
  type InsertPenjualan,
  type Pengeluaran,
  type InsertPengeluaran,
  type Stok,
  type InsertStok,
  type LogStok,
  type InsertLogStok,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte, sql } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Supplier operations
  getAllSuppliers(): Promise<Supplier[]>;
  getSupplier(id: number): Promise<Supplier | undefined>;
  createSupplier(supplier: InsertSupplier): Promise<Supplier>;
  updateSupplier(id: number, supplier: Partial<InsertSupplier>): Promise<Supplier>;
  deleteSupplier(id: number): Promise<void>;

  // Customer operations
  getAllCustomers(): Promise<Customer[]>;
  getCustomer(id: number): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: number, customer: Partial<InsertCustomer>): Promise<Customer>;
  deleteCustomer(id: number): Promise<void>;

  // Pembelian operations
  getAllPembelian(): Promise<Pembelian[]>;
  getPembelian(id: number): Promise<Pembelian | undefined>;
  createPembelian(pembelian: InsertPembelian): Promise<Pembelian>;
  updatePembelian(id: number, pembelian: Partial<InsertPembelian>): Promise<Pembelian>;
  deletePembelian(id: number): Promise<void>;

  // Pengeringan operations
  getAllPengeringan(): Promise<Pengeringan[]>;
  getPengeringan(id: number): Promise<Pengeringan | undefined>;
  createPengeringan(pengeringan: InsertPengeringan): Promise<Pengeringan>;
  updatePengeringan(id: number, pengeringan: Partial<InsertPengeringan>): Promise<Pengeringan>;
  deletePengeringan(id: number): Promise<void>;

  // Produksi operations
  getAllProduksi(): Promise<Produksi[]>;
  getProduksi(id: number): Promise<Produksi | undefined>;
  createProduksi(produksi: InsertProduksi): Promise<Produksi>;
  updateProduksi(id: number, produksi: Partial<InsertProduksi>): Promise<Produksi>;
  deleteProduksi(id: number): Promise<void>;

  // Penjualan operations
  getAllPenjualan(): Promise<Penjualan[]>;
  getPenjualan(id: number): Promise<Penjualan | undefined>;
  createPenjualan(penjualan: InsertPenjualan): Promise<Penjualan>;
  updatePenjualan(id: number, penjualan: Partial<InsertPenjualan>): Promise<Penjualan>;
  deletePenjualan(id: number): Promise<void>;

  // Pengeluaran operations
  getAllPengeluaran(): Promise<Pengeluaran[]>;
  getPengeluaran(id: number): Promise<Pengeluaran | undefined>;
  createPengeluaran(pengeluaran: InsertPengeluaran): Promise<Pengeluaran>;
  updatePengeluaran(id: number, pengeluaran: Partial<InsertPengeluaran>): Promise<Pengeluaran>;
  deletePengeluaran(id: number): Promise<void>;

  // Stok operations
  getAllStok(): Promise<Stok[]>;
  getStok(id: number): Promise<Stok | undefined>;
  createStok(stok: InsertStok): Promise<Stok>;
  updateStok(id: number, stok: Partial<InsertStok>): Promise<Stok>;
  deleteStok(id: number): Promise<void>;

  // Log Stok operations
  getAllLogStok(): Promise<LogStok[]>;
  getLogStok(id: number): Promise<LogStok | undefined>;
  createLogStok(logStok: InsertLogStok): Promise<LogStok>;

  // Dashboard metrics
  getDashboardMetrics(): Promise<{
    todayPurchases: number;
    todayProduction: number;
    todaySales: number;
    stockRice: number;
    recentTransactions: any[];
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Supplier operations
  async getAllSuppliers(): Promise<Supplier[]> {
    return await db.select().from(suppliers).orderBy(desc(suppliers.createdAt));
  }

  async getSupplier(id: number): Promise<Supplier | undefined> {
    const [supplier] = await db.select().from(suppliers).where(eq(suppliers.id, id));
    return supplier || undefined;
  }

  async createSupplier(insertSupplier: InsertSupplier): Promise<Supplier> {
    const [supplier] = await db.insert(suppliers).values(insertSupplier).returning();
    return supplier;
  }

  async updateSupplier(id: number, updateSupplier: Partial<InsertSupplier>): Promise<Supplier> {
    const [supplier] = await db.update(suppliers).set(updateSupplier).where(eq(suppliers.id, id)).returning();
    return supplier;
  }

  async deleteSupplier(id: number): Promise<void> {
    await db.delete(suppliers).where(eq(suppliers.id, id));
  }

  // Customer operations
  async getAllCustomers(): Promise<Customer[]> {
    return await db.select().from(customers).orderBy(desc(customers.createdAt));
  }

  async getCustomer(id: number): Promise<Customer | undefined> {
    const [customer] = await db.select().from(customers).where(eq(customers.id, id));
    return customer || undefined;
  }

  async createCustomer(insertCustomer: InsertCustomer): Promise<Customer> {
    const [customer] = await db.insert(customers).values(insertCustomer).returning();
    return customer;
  }

  async updateCustomer(id: number, updateCustomer: Partial<InsertCustomer>): Promise<Customer> {
    const [customer] = await db.update(customers).set(updateCustomer).where(eq(customers.id, id)).returning();
    return customer;
  }

  async deleteCustomer(id: number): Promise<void> {
    await db.delete(customers).where(eq(customers.id, id));
  }

  // Pembelian operations
  async getAllPembelian(): Promise<Pembelian[]> {
    return await db.select().from(pembelian).orderBy(desc(pembelian.createdAt));
  }

  async getPembelian(id: number): Promise<Pembelian | undefined> {
    const [item] = await db.select().from(pembelian).where(eq(pembelian.id, id));
    return item || undefined;
  }

  async createPembelian(insertPembelian: InsertPembelian): Promise<Pembelian> {
    const [item] = await db.insert(pembelian).values(insertPembelian).returning();
    return item;
  }

  async updatePembelian(id: number, updatePembelian: Partial<InsertPembelian>): Promise<Pembelian> {
    const [item] = await db.update(pembelian).set(updatePembelian).where(eq(pembelian.id, id)).returning();
    return item;
  }

  async deletePembelian(id: number): Promise<void> {
    await db.delete(pembelian).where(eq(pembelian.id, id));
  }

  // Pengeringan operations
  async getAllPengeringan(): Promise<Pengeringan[]> {
    return await db.select().from(pengeringan).orderBy(desc(pengeringan.createdAt));
  }

  async getPengeringan(id: number): Promise<Pengeringan | undefined> {
    const [item] = await db.select().from(pengeringan).where(eq(pengeringan.id, id));
    return item || undefined;
  }

  async createPengeringan(insertPengeringan: InsertPengeringan): Promise<Pengeringan> {
    const [item] = await db.insert(pengeringan).values(insertPengeringan).returning();
    return item;
  }

  async updatePengeringan(id: number, updatePengeringan: Partial<InsertPengeringan>): Promise<Pengeringan> {
    const [item] = await db.update(pengeringan).set(updatePengeringan).where(eq(pengeringan.id, id)).returning();
    return item;
  }

  async deletePengeringan(id: number): Promise<void> {
    await db.delete(pengeringan).where(eq(pengeringan.id, id));
  }

  // Produksi operations
  async getAllProduksi(): Promise<Produksi[]> {
    return await db.select().from(produksi).orderBy(desc(produksi.createdAt));
  }

  async getProduksi(id: number): Promise<Produksi | undefined> {
    const [item] = await db.select().from(produksi).where(eq(produksi.id, id));
    return item || undefined;
  }

  async createProduksi(insertProduksi: InsertProduksi): Promise<Produksi> {
    const [item] = await db.insert(produksi).values(insertProduksi).returning();
    return item;
  }

  async updateProduksi(id: number, updateProduksi: Partial<InsertProduksi>): Promise<Produksi> {
    const [item] = await db.update(produksi).set(updateProduksi).where(eq(produksi.id, id)).returning();
    return item;
  }

  async deleteProduksi(id: number): Promise<void> {
    await db.delete(produksi).where(eq(produksi.id, id));
  }

  // Penjualan operations
  async getAllPenjualan(): Promise<Penjualan[]> {
    return await db.select().from(penjualan).orderBy(desc(penjualan.createdAt));
  }

  async getPenjualan(id: number): Promise<Penjualan | undefined> {
    const [item] = await db.select().from(penjualan).where(eq(penjualan.id, id));
    return item || undefined;
  }

  async createPenjualan(insertPenjualan: InsertPenjualan): Promise<Penjualan> {
    const [item] = await db.insert(penjualan).values(insertPenjualan).returning();
    return item;
  }

  async updatePenjualan(id: number, updatePenjualan: Partial<InsertPenjualan>): Promise<Penjualan> {
    const [item] = await db.update(penjualan).set(updatePenjualan).where(eq(penjualan.id, id)).returning();
    return item;
  }

  async deletePenjualan(id: number): Promise<void> {
    await db.delete(penjualan).where(eq(penjualan.id, id));
  }

  // Pengeluaran operations
  async getAllPengeluaran(): Promise<Pengeluaran[]> {
    return await db.select().from(pengeluaran).orderBy(desc(pengeluaran.createdAt));
  }

  async getPengeluaran(id: number): Promise<Pengeluaran | undefined> {
    const [item] = await db.select().from(pengeluaran).where(eq(pengeluaran.id, id));
    return item || undefined;
  }

  async createPengeluaran(insertPengeluaran: InsertPengeluaran): Promise<Pengeluaran> {
    const [item] = await db.insert(pengeluaran).values(insertPengeluaran).returning();
    return item;
  }

  async updatePengeluaran(id: number, updatePengeluaran: Partial<InsertPengeluaran>): Promise<Pengeluaran> {
    const [item] = await db.update(pengeluaran).set(updatePengeluaran).where(eq(pengeluaran.id, id)).returning();
    return item;
  }

  async deletePengeluaran(id: number): Promise<void> {
    await db.delete(pengeluaran).where(eq(pengeluaran.id, id));
  }

  // Stok operations
  async getAllStok(): Promise<Stok[]> {
    return await db.select().from(stok).orderBy(desc(stok.updatedAt));
  }

  async getStok(id: number): Promise<Stok | undefined> {
    const [item] = await db.select().from(stok).where(eq(stok.id, id));
    return item || undefined;
  }

  async createStok(insertStok: InsertStok): Promise<Stok> {
    const [item] = await db.insert(stok).values(insertStok).returning();
    return item;
  }

  async updateStok(id: number, updateStok: Partial<InsertStok>): Promise<Stok> {
    const [item] = await db.update(stok).set(updateStok).where(eq(stok.id, id)).returning();
    return item;
  }

  async deleteStok(id: number): Promise<void> {
    await db.delete(stok).where(eq(stok.id, id));
  }

  // Log Stok operations
  async getAllLogStok(): Promise<LogStok[]> {
    return await db.select().from(logStok).orderBy(desc(logStok.createdAt));
  }

  async getLogStok(id: number): Promise<LogStok | undefined> {
    const [item] = await db.select().from(logStok).where(eq(logStok.id, id));
    return item || undefined;
  }

  async createLogStok(insertLogStok: InsertLogStok): Promise<LogStok> {
    const [item] = await db.insert(logStok).values(insertLogStok).returning();
    return item;
  }

  // Dashboard metrics
  async getDashboardMetrics(): Promise<{
    todayPurchases: number;
    todayProduction: number;
    todaySales: number;
    stockRice: number;
    stockGabah?: number; // UPDATE INI UNTUK MULTI PRODUK
    stockKatul?: number; // UPDATE INI UNTUK MULTI PRODUK
    stockMenir?: number; // UPDATE INI UNTUK MULTI PRODUK
    stockSekam?: number; // UPDATE INI UNTUK MULTI PRODUK
    recentTransactions: any[];
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Today's purchases
    const todayPurchases = await db
      .select({ total: sql<number>`sum(${pembelian.jumlah})` })
      .from(pembelian)
      .where(and(gte(pembelian.tanggal, today), lte(pembelian.tanggal, tomorrow)));

    // Today's production
    const todayProduction = await db
      .select({ total: sql<number>`sum(${produksi.jumlahBerasOutput})` })
      .from(produksi)
      .where(and(gte(produksi.tanggal, today), lte(produksi.tanggal, tomorrow)));

    // Today's sales
    const todaySales = await db
      .select({ total: sql<number>`sum(${penjualan.jumlah})` })
      .from(penjualan)
      .where(and(gte(penjualan.tanggal, today), lte(penjualan.tanggal, tomorrow)));

    // Rice stock
    const riceStock = await db
      .select({ total: sql<number>`sum(${stok.jumlah})` })
      .from(stok)
      .where(eq(stok.jenisItem, 'beras'));

    // UPDATE INI UNTUK MULTI PRODUK - Stock untuk jenis barang lainnya
    const gabahStock = await db
      .select({ total: sql<number>`sum(${stok.jumlah})` })
      .from(stok)
      .where(eq(stok.jenisItem, 'gabah'));

    const katulStock = await db
      .select({ total: sql<number>`sum(${stok.jumlah})` })
      .from(stok)
      .where(eq(stok.jenisItem, 'katul'));

    const menirStock = await db
      .select({ total: sql<number>`sum(${stok.jumlah})` })
      .from(stok)
      .where(eq(stok.jenisItem, 'menir'));

    const sekamStock = await db
      .select({ total: sql<number>`sum(${stok.jumlah})` })
      .from(stok)
      .where(eq(stok.jenisItem, 'sekam'));

    // Recent transactions
    const recentTransactions = await db
      .select({
        id: pembelian.id,
        type: sql<string>`'pembelian'`,
        description: sql<string>`'Pembelian Gabah'`,
        amount: pembelian.jumlah,
        value: pembelian.totalHarga,
        date: pembelian.createdAt,
      })
      .from(pembelian)
      .orderBy(desc(pembelian.createdAt))
      .limit(10);

    return {
      todayPurchases: todayPurchases[0]?.total || 0,
      todayProduction: todayProduction[0]?.total || 0,
      todaySales: todaySales[0]?.total || 0,
      stockRice: riceStock[0]?.total || 0,
      stockGabah: gabahStock[0]?.total || 0, // UPDATE INI UNTUK MULTI PRODUK
      stockKatul: katulStock[0]?.total || 0, // UPDATE INI UNTUK MULTI PRODUK
      stockMenir: menirStock[0]?.total || 0, // UPDATE INI UNTUK MULTI PRODUK
      stockSekam: sekamStock[0]?.total || 0, // UPDATE INI UNTUK MULTI PRODUK
      recentTransactions,
    };
  }
}

export const storage = new DatabaseStorage();
