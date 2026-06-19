const { app, BrowserWindow } = require('electron');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { startWebSocketServer, stopWebSocketServer } = require('./server.js');

// --- Lightweight Static HTTP Web Server ---
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon'
};

let webServer = null;

function startWebServer(port = 8080) {
  webServer = http.createServer((req, res) => {
    // Strip query parameters (like ?v=4) and set default index.html
    const parsedUrl = req.url.split('?')[0];
    let filePath = path.join(__dirname, parsedUrl === '/' ? 'index.html' : parsedUrl);
    
    // Prevent directory traversal attacks
    if (!filePath.startsWith(__dirname)) {
      res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('403 Forbidden');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
      if (err) {
        if (err.code === 'ENOENT') {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('404 Not Found');
        } else {
          res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end(`Server Error: ${err.code}`);
        }
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      }
    });
  });

  webServer.listen(port, () => {
    console.log(`🌍 게임 로컬 웹 서버가 포트 ${port}에서 실행 중입니다...`);
  });
}

function stopWebServer() {
  if (webServer) {
    webServer.close();
    webServer = null;
    console.log('🧹 로컬 웹 서버가 정상 종료되었습니다.');
  }
}

// --- Electron Window Lifecycle Management ---
let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1120,
    height: 780,
    minWidth: 1040,
    minHeight: 720,
    title: '스탯 아레나 (Stat Arena)',
    useContentSize: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Load the web server URL
  mainWindow.loadURL('http://localhost:8080');

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Start HTTP, WS servers and initialize electron app window
app.whenReady().then(() => {
  startWebServer(8080);
  startWebSocketServer(8081);
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, and stop servers
app.on('window-all-closed', () => {
  stopWebServer();
  stopWebSocketServer();
  
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  stopWebServer();
  stopWebSocketServer();
});
