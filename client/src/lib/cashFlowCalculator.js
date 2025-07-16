// Cash Flow Calculator Helper
// Handles all financial calculations for the dashboard

/**
 * Calculate weekly cash flow based on transactions
 * @param {Array} penjualan - Sales transactions
 * @param {Array} pembelian - Purchase transactions  
 * @param {Array} pengeluaran - Expense transactions
 * @param {number} modalAwal - Initial capital
 * @returns {Object} Cash flow summary
 */
export function calculateWeeklyCashFlow(penjualan = [], pembelian = [], pengeluaran = [], modalAwal = 50000000) {
  const now = new Date();
  const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
  
  // Filter transactions for this week
  const weeklyPenjualan = penjualan.filter(item => new Date(item.tanggal) >= weekStart);
  const weeklyPembelian = pembelian.filter(item => new Date(item.tanggal) >= weekStart);
  const weeklyPengeluaran = pengeluaran.filter(item => new Date(item.tanggal) >= weekStart);
  
  // Calculate totals
  const totalPemasukan = weeklyPenjualan.reduce((sum, item) => sum + (parseFloat(item.totalHarga) || 0), 0);
  const totalPembelian = weeklyPembelian.reduce((sum, item) => sum + (parseFloat(item.totalHarga) || 0), 0);
  const totalPengeluaran = weeklyPengeluaran.reduce((sum, item) => sum + (parseFloat(item.jumlah) || 0), 0);
  
  const totalKeluar = totalPembelian + totalPengeluaran;
  const saldoAkhir = modalAwal + totalPemasukan - totalKeluar;
  const netFlow = totalPemasukan - totalKeluar;
  
  // Determine status
  let status = "BEP";
  let statusColor = "text-yellow-600";
  let statusBg = "bg-yellow-50";
  let statusIcon = "⚖️";
  
  if (netFlow > 0) {
    status = "Untung";
    statusColor = "text-green-600";
    statusBg = "bg-green-50";
    statusIcon = "🟢";
  } else if (netFlow < 0) {
    status = "Rugi";
    statusColor = "text-red-600";
    statusBg = "bg-red-50";
    statusIcon = "🔴";
  }
  
  return {
    modalAwal,
    pemasukan: totalPemasukan,
    pengeluaran: totalKeluar,
    saldoAkhir,
    netFlow,
    status,
    statusColor,
    statusBg,
    statusIcon
  };
}

/**
 * Generate daily cash flow data for the last 7 days
 * @param {Array} penjualan - Sales transactions
 * @param {Array} pembelian - Purchase transactions
 * @param {Array} pengeluaran - Expense transactions
 * @returns {Array} Daily cash flow data for charting
 */
export function generateDailyCashFlowData(penjualan = [], pembelian = [], pengeluaran = []) {
  const days = [];
  const now = new Date();
  
  // Generate last 7 days
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    // Filter transactions for this day
    const dailyPenjualan = penjualan.filter(item => 
      new Date(item.tanggal).toISOString().split('T')[0] === dateStr
    );
    const dailyPembelian = pembelian.filter(item => 
      new Date(item.tanggal).toISOString().split('T')[0] === dateStr
    );
    const dailyPengeluaran = pengeluaran.filter(item => 
      new Date(item.tanggal).toISOString().split('T')[0] === dateStr
    );
    
    // Calculate daily totals
    const pemasukan = dailyPenjualan.reduce((sum, item) => sum + (parseFloat(item.totalHarga) || 0), 0);
    const pembelianTotal = dailyPembelian.reduce((sum, item) => sum + (parseFloat(item.totalHarga) || 0), 0);
    const pengeluaranTotal = dailyPengeluaran.reduce((sum, item) => sum + (parseFloat(item.jumlah) || 0), 0);
    const pengeluaranDay = pembelianTotal + pengeluaranTotal;
    
    days.push({
      date: date.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' }),
      dateStr,
      pemasukan,
      pengeluaran: pengeluaranDay,
      net: pemasukan - pengeluaranDay
    });
  }
  
  return days;
}

/**
 * Format currency for Indonesian Rupiah
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Format number with Indonesian thousand separators
 * @param {number} num - Number to format
 * @returns {string} Formatted number string
 */
export function formatNumber(num) {
  return new Intl.NumberFormat('id-ID').format(num);
}