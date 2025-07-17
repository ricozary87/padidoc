import { pgTable, text, serial, integer, boolean, timestamp, decimal, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("operator"), // "admin", "operator"
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Password Reset Tokens table
export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  isUsed: boolean("is_used").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Suppliers table
export const suppliers = pgTable("suppliers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address"),
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Customers table
export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address"),
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Pembelian (Purchases) table
export const pembelian = pgTable("pembelian", {
  id: serial("id").primaryKey(),
  supplierId: integer("supplier_id").references(() => suppliers.id),
  tanggal: timestamp("tanggal").notNull(),
  jenisGabah: text("jenis_gabah").notNull(), // Kept for backward compatibility
  // UPDATE INI UNTUK MULTI PRODUK - Tambah field jenisBarang & asalBarang
  jenisBarang: text("jenis_barang").notNull().default("gabah"), // gabah, beras, katul, menir, dll
  asalBarang: text("asal_barang").default("pembelian"), // pembelian, produksi
  jumlah: decimal("jumlah", { precision: 10, scale: 2 }).notNull(),
  hargaPerKg: decimal("harga_per_kg", { precision: 10, scale: 2 }).notNull(),
  totalHarga: decimal("total_harga", { precision: 12, scale: 2 }).notNull(),
  kadarAir: decimal("kadar_air", { precision: 5, scale: 2 }),
  kualitas: text("kualitas"),
  status: text("status").default("pending"),
  metodePembayaran: text("metode_pembayaran").default("cash"), // cash, transfer
  catatan: text("catatan"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Pengeringan (Drying) table
export const pengeringan = pgTable("pengeringan", {
  id: serial("id").primaryKey(),
  pembelianId: integer("pembelian_id").references(() => pembelian.id),
  tanggalMulai: timestamp("tanggal_mulai").notNull(),
  tanggalSelesai: timestamp("tanggal_selesai"),
  kadarAirAwal: decimal("kadar_air_awal", { precision: 5, scale: 2 }),
  kadarAirAkhir: decimal("kadar_air_akhir", { precision: 5, scale: 2 }),
  jumlahAwal: decimal("jumlah_awal", { precision: 10, scale: 2 }),
  jumlahAkhir: decimal("jumlah_akhir", { precision: 10, scale: 2 }),
  status: text("status").default("ongoing"),
  catatan: text("catatan"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Produksi (Production) table
export const produksi = pgTable("produksi", {
  id: serial("id").primaryKey(),
  pengeringanId: integer("pengeringan_id").references(() => pengeringan.id),
  tanggal: timestamp("tanggal").notNull(),
  jenisBerasProduced: text("jenis_beras_produced").notNull(),
  // UPDATE INI UNTUK MULTI PRODUK - Tambah field untuk fleksibilitas sumber bahan
  sumberBahan: text("sumber_bahan").default("pengeringan"), // pengeringan, pembelian_langsung
  pembelianId: integer("pembelian_id").references(() => pembelian.id), // Untuk produksi langsung dari pembelian
  jumlahGabahInput: decimal("jumlah_gabah_input", { precision: 10, scale: 2 }),
  jumlahBerasOutput: decimal("jumlah_beras_output", { precision: 10, scale: 2 }),
  jumlahDedak: decimal("jumlah_dedak", { precision: 10, scale: 2 }),
  jumlahMenir: decimal("jumlah_menir", { precision: 10, scale: 2 }),
  // UPDATE INI UNTUK MULTI PRODUK - Tambah field untuk hasil produksi lainnya
  jumlahKatul: decimal("jumlah_katul", { precision: 10, scale: 2 }),
  jumlahSekam: decimal("jumlah_sekam", { precision: 10, scale: 2 }),
  rendemen: decimal("rendemen", { precision: 5, scale: 2 }),
  status: text("status").default("completed"),
  catatan: text("catatan"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Penjualan (Sales) table
export const penjualan = pgTable("penjualan", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").references(() => customers.id),
  tanggal: timestamp("tanggal").notNull(),
  jenisBeras: text("jenis_beras").notNull(), // Kept for backward compatibility
  // UPDATE INI UNTUK MULTI PRODUK - Tambah field jenisBarang & asalBarang
  jenisBarang: text("jenis_barang").notNull().default("beras"), // beras, katul, menir, gabah, dll
  asalBarang: text("asal_barang").default("produksi"), // produksi, pembelian_langsung
  jumlah: decimal("jumlah", { precision: 10, scale: 2 }).notNull(),
  hargaPerKg: decimal("harga_per_kg", { precision: 10, scale: 2 }).notNull(),
  totalHarga: decimal("total_harga", { precision: 12, scale: 2 }).notNull(),
  status: text("status").default("completed"),
  metodePembayaran: text("metode_pembayaran").default("cash"), // cash, transfer
  catatan: text("catatan"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Pengeluaran (Expenses) table
export const pengeluaran = pgTable("pengeluaran", {
  id: serial("id").primaryKey(),
  tanggal: timestamp("tanggal").notNull(),
  kategori: text("kategori").notNull(),
  deskripsi: text("deskripsi").notNull(),
  jumlah: decimal("jumlah", { precision: 12, scale: 2 }).notNull(),
  catatan: text("catatan"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Stok (Stock) table
export const stok = pgTable("stok", {
  id: serial("id").primaryKey(),
  jenisItem: text("jenis_item").notNull(),
  jumlah: decimal("jumlah", { precision: 10, scale: 2 }).notNull(),
  satuan: text("satuan").notNull(),
  hargaRataRata: decimal("harga_rata_rata", { precision: 10, scale: 2 }),
  batasMinimum: decimal("batas_minimum", { precision: 10, scale: 2 }),
  lokasi: text("lokasi"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Log Stok (Stock Log) table
export const logStok = pgTable("log_stok", {
  id: serial("id").primaryKey(),
  stokId: integer("stok_id").references(() => stok.id),
  jenisTransaksi: text("jenis_transaksi").notNull(), // 'masuk', 'keluar', 'adjustment'
  jumlah: decimal("jumlah", { precision: 10, scale: 2 }).notNull(),
  jumlahSebelum: decimal("jumlah_sebelum", { precision: 10, scale: 2 }),
  jumlahSesudah: decimal("jumlah_sesudah", { precision: 10, scale: 2 }),
  referensiId: integer("referensi_id"), // ID from related table (pembelian, penjualan, etc.)
  referensiTabel: text("referensi_tabel"), // Table name of the reference
  keterangan: text("keterangan"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Settings table untuk menyimpan informasi perusahaan
export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  companyName: varchar("company_name", { length: 255 }).notNull(),
  companyAddress: text("company_address"),
  companyPhone: varchar("company_phone", { length: 50 }),
  companyEmail: varchar("company_email", { length: 255 }),
  companyLogo: text("company_logo"), // Base64 encoded logo
  companyNpwp: varchar("company_npwp", { length: 50 }),
  invoiceFooter: text("invoice_footer"),
  bankName: varchar("bank_name", { length: 100 }),
  bankAccount: varchar("bank_account", { length: 50 }),
  bankAccountName: varchar("bank_account_name", { length: 255 }),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const suppliersRelations = relations(suppliers, ({ many }) => ({
  pembelian: many(pembelian),
}));

export const customersRelations = relations(customers, ({ many }) => ({
  penjualan: many(penjualan),
}));

export const pembelianRelations = relations(pembelian, ({ one, many }) => ({
  supplier: one(suppliers, {
    fields: [pembelian.supplierId],
    references: [suppliers.id],
  }),
  pengeringan: many(pengeringan),
  // UPDATE INI UNTUK MULTI PRODUK - Relasi untuk produksi langsung dari pembelian
  produksi: many(produksi),
}));

export const pengeringanRelations = relations(pengeringan, ({ one, many }) => ({
  pembelian: one(pembelian, {
    fields: [pengeringan.pembelianId],
    references: [pembelian.id],
  }),
  produksi: many(produksi),
}));

export const produksiRelations = relations(produksi, ({ one }) => ({
  pengeringan: one(pengeringan, {
    fields: [produksi.pengeringanId],
    references: [pengeringan.id],
  }),
  // UPDATE INI UNTUK MULTI PRODUK - Relasi untuk produksi langsung dari pembelian
  pembelian: one(pembelian, {
    fields: [produksi.pembelianId],
    references: [pembelian.id],
  }),
}));

export const penjualanRelations = relations(penjualan, ({ one }) => ({
  customer: one(customers, {
    fields: [penjualan.customerId],
    references: [customers.id],
  }),
}));

export const stokRelations = relations(stok, ({ many }) => ({
  logStok: many(logStok),
}));

export const logStokRelations = relations(logStok, ({ one }) => ({
  stok: one(stok, {
    fields: [logStok.stokId],
    references: [stok.id],
  }),
}));

// PRIORITAS AUDIT - FIXED: Insert schemas dengan validasi yang lebih ketat
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, updatedAt: true }).extend({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  role: z.enum(["admin", "operator"], {
    errorMap: () => ({ message: "Role harus admin atau operator" })
  })
});

export const loginUserSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(1, "Password harus diisi")
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Email tidak valid")
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token harus diisi"),
  newPassword: z.string().min(6, "Password baru minimal 6 karakter")
});

export const editProfileSchema = z.object({
  username: z.string().min(1, "Username harus diisi").optional(),
  email: z.string().email("Email tidak valid").optional(),
  currentPassword: z.string().min(1, "Password lama harus diisi").optional(),
  newPassword: z.string().min(6, "Password baru minimal 6 karakter").optional(),
}).refine((data) => {
  // Jika ada newPassword, maka currentPassword harus diisi
  if (data.newPassword && !data.currentPassword) {
    return false;
  }
  return true;
}, {
  message: "Password lama harus diisi saat mengubah password",
  path: ["currentPassword"]
});
export const insertSupplierSchema = createInsertSchema(suppliers).omit({ id: true, createdAt: true });
export const insertCustomerSchema = createInsertSchema(customers).omit({ id: true, createdAt: true });

export const insertPembelianSchema = createInsertSchema(pembelian).omit({ id: true, createdAt: true }).extend({
  jumlah: z.string().refine(val => parseFloat(val) > 0, {
    message: "Jumlah harus lebih dari 0"
  }),
  hargaPerKg: z.string().refine(val => parseFloat(val) > 0, {
    message: "Harga per kg harus lebih dari 0"
  }),
  totalHarga: z.string().refine(val => parseFloat(val) > 0, {
    message: "Total harga harus lebih dari 0"
  }),
  kadarAir: z.string().optional().refine(val => !val || (parseFloat(val) >= 0 && parseFloat(val) <= 100), {
    message: "Kadar air harus antara 0-100%"
  }),
  tanggal: z.union([z.date(), z.string()]).transform(val => {
    if (typeof val === 'string') {
      return new Date(val);
    }
    return val;
  }).refine(date => date <= new Date(), {
    message: "Tanggal tidak boleh di masa depan"
  })
});

export const insertPengeringanSchema = createInsertSchema(pengeringan).omit({ id: true, createdAt: true }).extend({
  tanggalMulai: z.union([z.date(), z.string()]).transform(val => {
    if (typeof val === 'string') {
      return new Date(val);
    }
    return val;
  }).refine(date => date <= new Date(), {
    message: "Tanggal mulai tidak boleh di masa depan"
  }),
  tanggalSelesai: z.union([z.date(), z.string()]).optional().transform(val => {
    if (typeof val === 'string') {
      return new Date(val);
    }
    return val;
  }).refine(date => !date || date >= new Date(), {
    message: "Tanggal selesai tidak boleh di masa lalu"
  }),
  kadarAirAwal: z.string().optional().refine(val => !val || (parseFloat(val) >= 0 && parseFloat(val) <= 100), {
    message: "Kadar air awal harus antara 0-100%"
  }),
  kadarAirAkhir: z.string().optional().refine(val => !val || (parseFloat(val) >= 0 && parseFloat(val) <= 100), {
    message: "Kadar air akhir harus antara 0-100%"
  }),
  jumlahAwal: z.string().optional().refine(val => !val || parseFloat(val) > 0, {
    message: "Jumlah awal harus lebih dari 0"
  }),
  jumlahAkhir: z.string().optional().refine(val => !val || parseFloat(val) > 0, {
    message: "Jumlah akhir harus lebih dari 0"
  })
});

export const insertProduksiSchema = createInsertSchema(produksi).omit({ id: true, createdAt: true }).extend({
  jumlahGabahInput: z.string().optional().refine(val => !val || parseFloat(val) > 0, {
    message: "Jumlah gabah input harus lebih dari 0"
  }),
  jumlahBerasOutput: z.string().optional().refine(val => !val || parseFloat(val) > 0, {
    message: "Jumlah beras output harus lebih dari 0"
  }),
  jumlahDedak: z.string().optional().refine(val => !val || parseFloat(val) >= 0, {
    message: "Jumlah dedak tidak boleh negatif"
  }),
  jumlahMenir: z.string().optional().refine(val => !val || parseFloat(val) >= 0, {
    message: "Jumlah menir tidak boleh negatif"
  }),
  jumlahKatul: z.string().optional().refine(val => !val || parseFloat(val) >= 0, {
    message: "Jumlah katul tidak boleh negatif"
  }),
  jumlahSekam: z.string().optional().refine(val => !val || parseFloat(val) >= 0, {
    message: "Jumlah sekam tidak boleh negatif"
  }),
  rendemen: z.string().optional().refine(val => !val || (parseFloat(val) >= 0 && parseFloat(val) <= 100), {
    message: "Rendemen harus antara 0-100%"
  }),
  tanggal: z.union([z.date(), z.string()]).transform(val => {
    if (typeof val === 'string') {
      return new Date(val);
    }
    return val;
  }).refine(date => date <= new Date(), {
    message: "Tanggal tidak boleh di masa depan"
  })
});

export const insertPenjualanSchema = createInsertSchema(penjualan).omit({ id: true, createdAt: true }).extend({
  jumlah: z.string().refine(val => parseFloat(val) > 0, {
    message: "Jumlah harus lebih dari 0"
  }),
  hargaPerKg: z.string().refine(val => parseFloat(val) > 0, {
    message: "Harga per kg harus lebih dari 0"
  }),
  totalHarga: z.string().refine(val => parseFloat(val) > 0, {
    message: "Total harga harus lebih dari 0"
  }),
  tanggal: z.union([z.date(), z.string()]).transform(val => {
    if (typeof val === 'string') {
      return new Date(val);
    }
    return val;
  }).refine(date => date <= new Date(), {
    message: "Tanggal tidak boleh di masa depan"
  })
});

export const insertPengeluaranSchema = createInsertSchema(pengeluaran).omit({ id: true, createdAt: true }).extend({
  jumlah: z.string().refine(val => parseFloat(val) > 0, {
    message: "Jumlah pengeluaran harus lebih dari 0"
  }),
  tanggal: z.union([z.date(), z.string()]).transform(val => {
    if (typeof val === 'string') {
      return new Date(val);
    }
    return val;
  }).refine(date => date <= new Date(), {
    message: "Tanggal tidak boleh di masa depan"
  })
});

export const insertStokSchema = createInsertSchema(stok).omit({ id: true, updatedAt: true }).extend({
  jumlah: z.string().refine(val => parseFloat(val) >= 0, {
    message: "Jumlah stok tidak boleh negatif"
  }),
  hargaRataRata: z.string().optional().refine(val => !val || parseFloat(val) >= 0, {
    message: "Harga rata-rata tidak boleh negatif"
  }),
  batasMinimum: z.string().optional().refine(val => !val || parseFloat(val) >= 0, {
    message: "Batas minimum tidak boleh negatif"
  })
});

export const insertLogStokSchema = createInsertSchema(logStok).omit({ id: true, createdAt: true });
export const insertSettingsSchema = createInsertSchema(settings).omit({ id: true, updatedAt: true });
export const insertPasswordResetTokenSchema = createInsertSchema(passwordResetTokens).omit({ id: true, createdAt: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Supplier = typeof suppliers.$inferSelect;
export type InsertSupplier = z.infer<typeof insertSupplierSchema>;
export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type Pembelian = typeof pembelian.$inferSelect;
export type InsertPembelian = z.infer<typeof insertPembelianSchema>;
export type Pengeringan = typeof pengeringan.$inferSelect;
export type InsertPengeringan = z.infer<typeof insertPengeringanSchema>;
export type Produksi = typeof produksi.$inferSelect;
export type InsertProduksi = z.infer<typeof insertProduksiSchema>;
export type Penjualan = typeof penjualan.$inferSelect;
export type InsertPenjualan = z.infer<typeof insertPenjualanSchema>;
export type Pengeluaran = typeof pengeluaran.$inferSelect;
export type InsertPengeluaran = z.infer<typeof insertPengeluaranSchema>;
export type Stok = typeof stok.$inferSelect;
export type InsertStok = z.infer<typeof insertStokSchema>;
export type LogStok = typeof logStok.$inferSelect;
export type InsertLogStok = z.infer<typeof insertLogStokSchema>;
export type Settings = typeof settings.$inferSelect;
export type InsertSettings = z.infer<typeof insertSettingsSchema>;
export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;
export type InsertPasswordResetToken = z.infer<typeof insertPasswordResetTokenSchema>;
