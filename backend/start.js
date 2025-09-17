#!/usr/bin/env node

// Simple start script for Railway deployment
const { spawn } = require('child_process');
const path = require('path');

console.log('Starting UPFLYOVER Backend...');
console.log('Working directory:', process.cwd());
console.log('Node version:', process.version);

// Start the server
const server = spawn('node', ['server.js'], {
  stdio: 'inherit',
  cwd: __dirname
});

server.on('error', (err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

server.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
  process.exit(code);
});

// Handle process termination
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully...');
  server.kill('SIGTERM');
});

process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully...');
  server.kill('SIGINT');
});