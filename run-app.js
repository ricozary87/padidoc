import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files
app.use(express.static(path.join(__dirname, 'client')));

// Temporary storage for settings
let settings = {
  companyName: "CV CAKRA PAMUNGKAS",
  companyAddress: "Jatiluhur rt 02 rw 03 karanganyar kebumen jateng",
  companyPhone: "085228003820",
  companyEmail: "cakrapamungka@gmail.com",
  companyNpwp: "12.345.678.9-123.000"
};

// API Routes
app.get('/api/settings', (req, res) => {
  console.log('GET /api/settings - returning:', settings);
  res.json(settings);
});

app.post('/api/settings', (req, res) => {
  console.log('POST /api/settings - received:', req.body);
  console.log('Phone number received:', req.body.companyPhone);
  
  // Update settings
  settings = { ...settings, ...req.body };
  
  console.log('Settings after update:', settings);
  console.log('Phone number after update:', settings.companyPhone);
  
  res.json({ 
    success: true, 
    message: 'Settings saved successfully',
    data: settings 
  });
});

// Auth endpoint (mock)
app.post('/api/auth/login', (req, res) => {
  res.json({
    success: true,
    token: "test-token",
    user: { email: "admin@padidoc.com", role: "admin" }
  });
});

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`App running on port ${PORT}`);
  console.log(`Test URL: http://localhost:${PORT}`);
  console.log(`Settings test: http://localhost:${PORT}/test-form.html`);
});