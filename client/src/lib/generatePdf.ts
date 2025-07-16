import jsPDF from "jspdf";
import "jspdf-autotable";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

interface CompanySettings {
  companyName?: string;
  companyAddress?: string;
  companyPhone?: string;
  companyEmail?: string;
  companyNpwp?: string;
  invoiceFooter?: string;
  bankName?: string;
  bankAccount?: string;
  bankAccountName?: string;
  companyLogo?: string;
}

interface InvoiceData {
  type: "pembelian" | "penjualan";
  invoiceNumber: string;
  date: string;
  customerName: string;
  customerAddress?: string;
  customerPhone?: string;
  items: Array<{
    description: string;
    quantity: number;
    unit: string;
    price: number;
    total: number;
  }>;
  subtotal: number;
  tax?: number;
  discount?: number;
  total: number;
  notes?: string;
  paymentMethod?: string;
  dueDate?: string;
}

export function generateInvoicePdf(settings: CompanySettings | null, invoiceData: InvoiceData) {
  const doc = new jsPDF();
  let yPosition = 20;

  // Default company settings if not provided
  const company = {
    name: settings?.companyName || "Penggilingan Padi",
    address: settings?.companyAddress || "Alamat belum diatur",
    phone: settings?.companyPhone || "Telepon belum diatur",
    email: settings?.companyEmail || "",
    npwp: settings?.companyNpwp || "",
    logo: settings?.companyLogo || "",
    footer: settings?.invoiceFooter || "Terima kasih atas kepercayaan Anda",
    bankName: settings?.bankName || "",
    bankAccount: settings?.bankAccount || "",
    bankAccountName: settings?.bankAccountName || "",
  };

  // Add company logo if available
  if (company.logo) {
    try {
      doc.addImage(company.logo, "PNG", 15, yPosition, 30, 30);
      yPosition = 55;
    } catch (error) {
      console.error("Error adding logo:", error);
    }
  }

  // Company header
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text(company.name.toUpperCase(), company.logo ? 50 : 15, yPosition);
  
  yPosition += 8;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(company.address, company.logo ? 50 : 15, yPosition);
  
  yPosition += 5;
  if (company.phone || company.email) {
    const contact = [];
    if (company.phone) contact.push(`Telp: ${company.phone}`);
    if (company.email) contact.push(`Email: ${company.email}`);
    doc.text(contact.join(" | "), company.logo ? 50 : 15, yPosition);
  }
  
  if (company.npwp) {
    yPosition += 5;
    doc.text(`NPWP: ${company.npwp}`, company.logo ? 50 : 15, yPosition);
  }

  // Line separator
  yPosition += 10;
  doc.setLineWidth(0.5);
  doc.line(15, yPosition, 195, yPosition);

  // Invoice title
  yPosition += 10;
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  const title = invoiceData.type === "pembelian" ? "NOTA PEMBELIAN" : "NOTA PENJUALAN";
  doc.text(title, 105, yPosition, { align: "center" });

  // Invoice details
  yPosition += 10;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  
  // Left side - Customer info
  doc.text("Kepada Yth:", 15, yPosition);
  yPosition += 5;
  doc.setFont("helvetica", "bold");
  doc.text(invoiceData.customerName, 15, yPosition);
  doc.setFont("helvetica", "normal");
  
  if (invoiceData.customerAddress) {
    yPosition += 5;
    const addressLines = doc.splitTextToSize(invoiceData.customerAddress, 80);
    doc.text(addressLines, 15, yPosition);
    yPosition += addressLines.length * 5;
  }
  
  if (invoiceData.customerPhone) {
    yPosition += 5;
    doc.text(`Telp: ${invoiceData.customerPhone}`, 15, yPosition);
  }

  // Right side - Invoice info
  const rightX = 140;
  let rightY = 85;
  
  doc.text("No. Nota:", rightX, rightY);
  doc.setFont("helvetica", "bold");
  doc.text(invoiceData.invoiceNumber, rightX + 25, rightY);
  doc.setFont("helvetica", "normal");
  
  rightY += 5;
  doc.text("Tanggal:", rightX, rightY);
  doc.text(format(new Date(invoiceData.date), "dd MMMM yyyy", { locale: localeId }), rightX + 25, rightY);
  
  if (invoiceData.dueDate) {
    rightY += 5;
    doc.text("Jatuh Tempo:", rightX, rightY);
    doc.text(format(new Date(invoiceData.dueDate), "dd MMMM yyyy", { locale: localeId }), rightX + 25, rightY);
  }

  // Items table
  yPosition = Math.max(yPosition + 10, rightY + 15);
  
  const tableColumns = ["No", "Deskripsi", "Jumlah", "Satuan", "Harga", "Total"];
  const tableRows = invoiceData.items.map((item, index) => [
    (index + 1).toString(),
    item.description,
    item.quantity.toLocaleString("id-ID"),
    item.unit,
    `Rp ${item.price.toLocaleString("id-ID")}`,
    `Rp ${item.total.toLocaleString("id-ID")}`,
  ]);

  (doc as any).autoTable({
    head: [tableColumns],
    body: tableRows,
    startY: yPosition,
    theme: "grid",
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontSize: 10,
      fontStyle: "bold",
    },
    bodyStyles: {
      fontSize: 9,
    },
    columnStyles: {
      0: { cellWidth: 15 },
      1: { cellWidth: 60 },
      2: { cellWidth: 20, halign: "right" },
      3: { cellWidth: 20, halign: "center" },
      4: { cellWidth: 35, halign: "right" },
      5: { cellWidth: 35, halign: "right" },
    },
  });

  // Get final Y position after table
  yPosition = (doc as any).lastAutoTable.finalY + 10;

  // Summary section
  const summaryX = 140;
  
  doc.text("Subtotal:", summaryX, yPosition);
  doc.text(`Rp ${invoiceData.subtotal.toLocaleString("id-ID")}`, 195, yPosition, { align: "right" });
  
  if (invoiceData.discount && invoiceData.discount > 0) {
    yPosition += 5;
    doc.text("Diskon:", summaryX, yPosition);
    doc.text(`Rp ${invoiceData.discount.toLocaleString("id-ID")}`, 195, yPosition, { align: "right" });
  }
  
  if (invoiceData.tax && invoiceData.tax > 0) {
    yPosition += 5;
    doc.text("Pajak:", summaryX, yPosition);
    doc.text(`Rp ${invoiceData.tax.toLocaleString("id-ID")}`, 195, yPosition, { align: "right" });
  }
  
  yPosition += 5;
  doc.setLineWidth(0.5);
  doc.line(summaryX, yPosition, 195, yPosition);
  
  yPosition += 5;
  doc.setFont("helvetica", "bold");
  doc.text("Total:", summaryX, yPosition);
  doc.text(`Rp ${invoiceData.total.toLocaleString("id-ID")}`, 195, yPosition, { align: "right" });
  doc.setFont("helvetica", "normal");

  // Payment info and notes
  yPosition += 15;
  
  if (invoiceData.paymentMethod) {
    doc.text(`Metode Pembayaran: ${invoiceData.paymentMethod}`, 15, yPosition);
    yPosition += 5;
  }
  
  if (company.bankName && company.bankAccount) {
    doc.text("Informasi Pembayaran:", 15, yPosition);
    yPosition += 5;
    doc.text(`Bank: ${company.bankName}`, 15, yPosition);
    yPosition += 5;
    doc.text(`No. Rekening: ${company.bankAccount}`, 15, yPosition);
    yPosition += 5;
    doc.text(`Atas Nama: ${company.bankAccountName}`, 15, yPosition);
    yPosition += 10;
  }
  
  if (invoiceData.notes) {
    doc.text("Catatan:", 15, yPosition);
    yPosition += 5;
    const noteLines = doc.splitTextToSize(invoiceData.notes, 180);
    doc.text(noteLines, 15, yPosition);
    yPosition += noteLines.length * 5;
  }

  // Signature section
  yPosition += 20;
  
  // Check if we need a new page for signatures
  if (yPosition > 240) {
    doc.addPage();
    yPosition = 20;
  }
  
  const signatureY = yPosition;
  
  // Left signature
  doc.text("Pembeli", 40, signatureY, { align: "center" });
  doc.text("(_________________)", 40, signatureY + 25, { align: "center" });
  
  // Right signature
  doc.text("Penjual", 155, signatureY, { align: "center" });
  doc.text("(_________________)", 155, signatureY + 25, { align: "center" });

  // Footer
  if (company.footer) {
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    const footerLines = doc.splitTextToSize(company.footer, 180);
    doc.text(footerLines, 105, 280, { align: "center" });
  }

  // Save the PDF
  const filename = `${title.replace(" ", "_")}_${invoiceData.invoiceNumber}_${format(
    new Date(invoiceData.date),
    "ddMMyyyy"
  )}.pdf`;
  
  doc.save(filename);
}

// Helper function to generate invoice number
export function generateInvoiceNumber(type: "pembelian" | "penjualan"): string {
  const prefix = type === "pembelian" ? "PB" : "PJ";
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
  
  return `${prefix}/${year}${month}${day}/${random}`;
}