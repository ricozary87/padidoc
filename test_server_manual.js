// Manual test server untuk menguji phone number issue
import express from 'express';
const app = express();

app.use(express.json());

// Temporary storage
let settings = {};

// GET settings
app.get('/api/settings', (req, res) => {
  console.log('GET /api/settings - Current settings:', settings);
  res.json(settings);
});

// POST settings
app.post('/api/settings', (req, res) => {
  console.log('POST /api/settings - Received data:', req.body);
  console.log('Phone number received:', req.body.companyPhone);
  
  settings = { ...req.body };
  
  console.log('Settings after save:', settings);
  console.log('Phone number after save:', settings.companyPhone);
  
  res.json({ 
    success: true, 
    message: 'Settings saved successfully',
    data: settings 
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});