import { app, BrowserWindow, Tray, Menu, Notification } from 'electron';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import isDev from 'electron-is-dev';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let tray = null;
let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadURL(
    isDev
      ? 'http://localhost:5173'
      : `file://${join(__dirname, '../dist/index.html')}`,
  );
}

function createTray() {
  tray = new Tray(join(__dirname, '../src/assets/chat.png'));

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Выход', click: () => app.quit() },
  ]);

  tray.setToolTip('Мессенджер');
  tray.setContextMenu(contextMenu);

  tray.on('click', () => {
    showNotification(); // Test notification
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
    }
  });
}
app.whenReady().then(() => {
  createWindow();
  createTray();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

function showNotification() {
  const notification = new Notification({
    title: 'Новое сообщение',
    body: 'У вас новое сообщение',
    icon: join(__dirname, '../src/assets/chat.png'),
    silent: false,
  });

  notification.show();

  notification.on('click', () => {
    mainWindow.show();
  });
}
