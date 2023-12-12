import { app, BrowserWindow } from 'electron';

// import * as path from "path";

let mainWindow: BrowserWindow | null;

function createWindow() {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
    });

    // Vite Dev ServerURL
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.on("close", () => mainWindow = null);
}

app.whenReady().then(() => {
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow == null) {
        createWindow();
    }
});
