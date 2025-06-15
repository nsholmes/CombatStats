import { spawn } from "child_process";
import { app, BrowserWindow, dialog, ipcMain } from "electron";
import { installExtension, REDUX_DEVTOOLS } from "electron-devtools-installer";
import * as fs from "fs";
import * as path from "path";
let mainWindow: BrowserWindow | null;

const isDev = process.env.NODE_ENV === "development";

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
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

// #region IPC Handlers

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
    dialog.showErrorBox(
      "File Not Found",
      `C:\\Users\\metap\\development\\nhe-cli\\data\\eventParticipants\\${eventUID}.${eventId}`
    );
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

ipcMain.on("refresh-event-participants", (event, eventUID, eventId) => {
  console.log("Event UID:", eventUID);
  console.log("Event ID:", eventId);
  console.log("event: ", event.type);
  const args = [eventUID, eventId].join(".");
  console.log("main: Received refresh-event-participants event");
  try {
    console.log("Spawning nhe-cli command with args:", args);
    // spawn(`node`, [`ikf participants -u ${args}`]);
    const child = spawn("ls", ["-lh", "/usr"]);
    console.log(child);
  } catch (error) {
    console.error("Error spawning nhe-cli command:", error);
    dialog.showErrorBox("Command Error", "Failed to refresh participants.");
  }
});

// #endregion IPC Handlers
