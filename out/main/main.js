"use strict";
const electron = require("electron");
let mainWindow;
function createWindow() {
  mainWindow = new electron.BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    }
  });
  mainWindow.loadURL("http://localhost:5173");
  mainWindow.on("close", () => mainWindow = null);
}
electron.app.whenReady().then(() => {
  createWindow();
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
electron.app.on("activate", () => {
  if (mainWindow == null) {
    createWindow();
  }
});
