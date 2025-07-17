import http from 'http';
import { parse } from 'url';

const server = http.createServer((req, res) => {
  const { pathname, method } = req;
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');
  
  if (method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  let settings = {};
  
  if (pathname === '/api/settings' && method === 'GET') {
    console.log('GET /api/settings - Current settings:', settings);
    res.writeHead(200);
    res.end(JSON.stringify(settings));
  } 
  else if (pathname === '/api/settings' && method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        console.log('POST /api/settings - Received data:', data);
        console.log('Phone number received:', data.companyPhone);
        
        settings = { ...data };
        
        console.log('Settings after save:', settings);
        console.log('Phone number after save:', settings.companyPhone);
        
        res.writeHead(200);
        res.end(JSON.stringify({ 
          success: true, 
          message: 'Settings saved successfully',
          data: settings 
        }));
      } catch (error) {
        console.error('Error parsing JSON:', error);
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
  }
  else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Simple server running on port ${PORT}`);
});