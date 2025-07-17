import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Temporary API endpoint to save settings
app.post('/api/settings', (req, res) => {
  console.log('Settings data received:', req.body);
  
  // Save to a temporary file
  const settingsFile = path.join(__dirname, 'temp-settings.json');
  fs.writeFileSync(settingsFile, JSON.stringify(req.body, null, 2));
  
  res.json({
    success: true,
    message: 'Settings saved successfully',
    data: req.body
  });
});

// Get settings
app.get('/api/settings', (req, res) => {
  const settingsFile = path.join(__dirname, 'temp-settings.json');
  
  if (fs.existsSync(settingsFile)) {
    const settings = JSON.parse(fs.readFileSync(settingsFile, 'utf8'));
    res.json(settings);
  } else {
    res.json({});
  }
});

// Login endpoint
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (email === 'admin@padidoc.com' && password === 'admin123') {
    res.json({
      success: true,
      token: 'temp-token-123',
      user: { email: 'admin@padidoc.com', role: 'admin' }
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Serve static files
app.use(express.static(path.join(__dirname, 'dist/public')));

// Catch-all handler
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/public/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Temporary server running on port ${port}`);
});