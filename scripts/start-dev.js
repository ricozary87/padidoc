#!/usr/bin/env node
import { spawn } from 'child_process';

console.log('Starting development server...');

const tsx = spawn('npx', ['tsx', 'server/index.ts'], {
  env: { ...process.env, NODE_ENV: 'development' },
  stdio: 'inherit',
  cwd: process.cwd()
});

tsx.on('error', (err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

tsx.on('exit', (code) => {
  process.exit(code);
});