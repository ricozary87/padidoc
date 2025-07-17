// Test untuk menguji form frontend Settings
const testData = {
  companyName: "CV CAKRA PAMUNGKAS",
  companyAddress: "Jatiluhur rt 02 rw 03 karanganyar kebumen jateng",
  companyPhone: "085228003820",
  companyEmail: "cakrapamungka@gmail.com",
  companyNpwp: "12.345.678.9-123.000",
  invoiceFooter: "Terima kasih atas kepercayaan Anda",
  bankName: "Bank BCA",
  bankAccount: "1234567890",
  bankAccountName: "CV CAKRA PAMUNGKAS"
};

console.log("Testing form data:");
console.log("Original phone:", testData.companyPhone);

// Simulate handleInputChange function
function handleInputChange(name, value) {
  console.log(`Input changed: ${name} = ${value}`);
  return value;
}

// Test phone number input
const phoneTest = handleInputChange("companyPhone", "085228003820");
console.log("Phone after input handling:", phoneTest);

// Test form submission data preparation
const formSubmissionData = {
  ...testData,
  companyPhone: testData.companyPhone
};

console.log("Form submission data:");
console.log(JSON.stringify(formSubmissionData, null, 2));