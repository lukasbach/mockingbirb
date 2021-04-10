import { app, BrowserWindow, protocol } from 'electron';
import * as path from 'path';
import * as url from 'url';
import serveStatic from 'serve-static';
import http from 'http';
import finalhandler from 'finalhandler';
import getPort from 'get-port';
import './updater';

console.log('process.env.NODE_ENV=', process.env.NODE_ENV);

app.whenReady().then(() => {
  protocol.registerFileProtocol('file', (request, callback) => {
    const pathname = decodeURI(request.url.replace('file:///', ''));
    callback(pathname);
  });
});

app.on('ready', async () => {
  let mainWindow: Electron.BrowserWindow | null = new BrowserWindow({
    width: 1000,
    height: 600,
    minWidth: 800,
    minHeight: 450,
    backgroundColor: '#121213',
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      worldSafeExecuteJavaScript: true,
      enableRemoteModule: true,
    },
  });

  if (process.env.NODE_ENV === 'development') {
    await mainWindow.loadURL(`http://localhost:4000`);
    // mainWindow.webContents.openDevTools();
  } else {
    const serve = serveStatic(path.join(app.getAppPath(), '/app/'), { 'index': ['index.html', 'index.htm'] })
    const server = http.createServer((req, res) => {
      serve(req as any, res as any, finalhandler as any);
    });
    const port = await getPort({ port: 9990 });
    server.listen(port);
    await mainWindow.loadURL(`http://localhost:${port}`);
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});

app.allowRendererProcessReuse = false;
// TODO maybe set to false?
// https://github.com/electron/electron/issues/22119

// In render process:
// setInterval(function(){
//   process.stdout.write("")
// },2)

// https://github.com/electron/electron/issues/19554