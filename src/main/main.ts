import { app, BrowserWindow, dialog, ipcMain } from "electron";

import * as path from "path";
import * as fs from "fs";
import { installExtension, REDUX_DEVTOOLS } from "electron-devtools-installer";
let mainWindow: BrowserWindow | null;
const isDev = process.env.NODE_ENV === "development";

const createWindow = () => {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(`${__dirname}/../preload`, "preload.js"),
      devTools: isDev,
    },
  });

  // Vite Dev ServerURL
  mainWindow.loadURL("http://localhost:5173");
  if (isDev) {
    console.log("--DEVELOPMENT--");
  }
  mainWindow.on("close", () => (mainWindow = null));
};

app.whenReady().then(() => {
  createWindow();
  // Errors are thrown if the dev tools are opened
  // before the DOM is ready
  installExtension(REDUX_DEVTOOLS)
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log("An error occurred: ", err))
    .finally(() => {
      mainWindow?.webContents.openDevTools();
    });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow == null) {
    createWindow();
  }
});

ipcMain.on("read-event-list", (event) => {
  console.log("main: received read-event-list event");
  const fileContent = fs.readFileSync(
    "C:\\Users\\metap\\development\\nhe-cli\\data\\eventsSummary",
    "utf8"
  );
  // console.log("main: file-content is: ", fileContent);
  event.sender.send("read-event-list-success", fileContent);
  console.log("main: sent read-event-list-success event.");
});

ipcMain.on("read-event-participants", (event, eventUID, eventId) => {
  console.log(
    "main: Received read-event-participants event",
    `${eventUID}.${eventId}`
  );
  let fileContent;
  try {
    fileContent = fs.readFileSync(
      `C:\\Users\\metap\\development\\nhe-cli\\data\\eventParticipants\\${eventUID}.${eventId}`,
      "utf8"
    );
    event.sender.send("read-event-participants-success", fileContent);
    console.log("Main: Received read-event-participants-success event.");
  } catch {
    dialog.showErrorBox("File Not Found", "File Not Found");
  }
});

ipcMain.on("read-event-brackets", (event, eventUID, eventId) => {
  console.log(
    "main: Received read-event-brackets event",
    `${eventUID}.${eventId}`
  );
  try {
    const fileContent = fs.readFileSync(
      `C:\\Users\\metap\\development\\nhe-cli\\data\\eventBrackets\\${eventUID}.${eventId}`,
      "utf8"
    );
    event.sender.send("read-event-brackets-success", fileContent);
    console.log("Main: Received read-event-brackets-success event.");
  } catch {
    dialog.showErrorBox("File Not Found", "File Not Found");
  }
});
