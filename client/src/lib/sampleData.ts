// Sample data for testing - can be used to populate the database
export const sampleSuppliers = [
  {
    nama: "Toko Tani Sejahtera",
    alamat: "Jl. Sawah No. 123, Desa Padi",
    telepon: "081234567890",
    email: "tani@example.com",
    pic: "Pak Tani"
  },
  {
    nama: "CV. Gabah Makmur",
    alamat: "Jl. Pertanian No. 456, Kec. Subur",
    telepon: "081234567891",
    email: "gabah@example.com",
    pic: "Bu Makmur"
  }
];

export const sampleCustomers = [
  {
    nama: "Warung Pak Budi",
    alamat: "Jl. Pasar No. 789, Kelurahan Ramai",
    telepon: "081234567892",
    email: "budi@example.com",
    pic: "Pak Budi"
  },
  {
    nama: "Toko Beras Sari",
    alamat: "Jl. Beras No. 101, Kota Sejahtera",
    telepon: "081234567893",
    email: "sari@example.com",
    pic: "Bu Sari"
  }
];

export const samplePembelian = [
  {
    supplierId: 1,
    tanggal: new Date('2024-01-15'),
    jenisGabah: "Gabah Premium",
    jenisBarang: "gabah",
    jumlah: 1000,
    hargaPerKg: 8000,
    totalHarga: 8000000,
    kadarAir: 12,
    kualitas: "A",
    status: "completed",
    catatan: "Kualitas bagus, pengiriman tepat waktu"
  },
  {
    supplierId: 2,
    tanggal: new Date('2024-01-14'),
    jenisGabah: "Gabah Medium",
    jenisBarang: "gabah",
    jumlah: 500,
    hargaPerKg: 7500,
    totalHarga: 3750000,
    kadarAir: 14,
    kualitas: "B",
    status: "completed",
    catatan: "Standar"
  }
];

export const samplePenjualan = [
  {
    customerId: 1,
    tanggal: new Date('2024-01-16'),
    jenisBeras: "Beras Premium",
    jenisBarang: "beras",
    jumlah: 50,
    hargaPerKg: 15000,
    totalHarga: 750000,
    status: "completed",
    catatan: "Pelanggan reguler"
  },
  {
    customerId: 2,
    tanggal: new Date('2024-01-15'),
    jenisBeras: "Beras Medium",
    jenisBarang: "beras",
    jumlah: 100,
    hargaPerKg: 12000,
    totalHarga: 1200000,
    status: "completed",
    catatan: "Pesanan besar"
  }
];