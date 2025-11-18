import { spawn } from "child_process";
import { app, BrowserWindow, dialog, ipcMain } from "electron";
import * as fs from "fs";
import * as path from "path";
import { IKFService } from "./services/ikfService";

let mainWindow: BrowserWindow | null;
let ikfService: IKFService;

const isDev = process.env.NODE_ENV === "development";

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      sandbox: false,
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
  // Initialize IKF Service
  ikfService = new IKFService();
  // Open DevTools without installing extensions in development
  if (isDev) {
    mainWindow?.webContents.openDevTools();
  }
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

// #region IKF Service IPC Handlers

// Events
ipcMain.handle('ikf:fetch-events', async () => {
  try {
    const events = await ikfService.fetchEventsFromFSI();
    return { success: true, data: events };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('ikf:read-events', async () => {
  try {
    const events = ikfService.readEventsFromFile();
    return { success: true, data: events };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

// Participants
ipcMain.handle('ikf:fetch-participants', async (_, eventUID: string, eventID: number) => {
  try {
    const participants = await ikfService.fetchEventParticipants(eventUID, eventID);
    return { success: true, data: participants };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('ikf:read-participants', async (_, eventUID: string, eventID: number) => {
  try {
    const participants = ikfService.readParticipantsFromFile(eventUID, eventID);
    return { success: true, data: participants };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('ikf:fetch-all-participants', async (event) => {
  try {
    const result = await ikfService.fetchAllParticipants(
      (current, total, eventName) => {
        event.sender.send('ikf:fetch-all-participants-progress', {
          current,
          total,
          eventName,
        });
      }
    );
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

// Brackets
ipcMain.handle('ikf:fetch-brackets', async (_, eventUID: string, eventID: number) => {
  try {
    const brackets = await ikfService.fetchEventBrackets(eventUID, eventID);
    return { success: true, data: brackets };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('ikf:read-brackets', async (_, eventUID: string, eventID: number) => {
  try {
    const brackets = ikfService.readBracketsFromFile(eventUID, eventID);
    return { success: true, data: brackets };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

// Enrichment
ipcMain.handle('ikf:enrich-participants', async (event, eventId?: string, forceUpdate?: boolean) => {
  try {
    const result = await ikfService.enrichParticipantsWithProfileId(
      eventId,
      forceUpdate,
      (current, total, participantName) => {
        event.sender.send('ikf:enrich-participants-progress', {
          current,
          total,
          participantName,
        });
      }
    );
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

// Status
ipcMain.handle('ikf:get-participant-status', async () => {
  try {
    const status = ikfService.getParticipantStatus();
    return { success: true, data: status };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('ikf:validate-token', async () => {
  try {
    const result = await ikfService.validateToken();
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('ikf:update-token', async (_, token: string) => {
  try {
    ikfService.updateAccessToken(token);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

// Firebase Sync
ipcMain.handle('ikf:sync-events-to-firebase', async (event) => {
  try {
    const result = await ikfService.syncEventsToFirebase(
      (current, total, eventName) => {
        event.sender.send('ikf:sync-events-progress', {
          current,
          total,
          eventName,
        });
      }
    );
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('ikf:sync-participants-to-firebase', async (_, eventUID: string, eventID: number) => {
  try {
    const result = await ikfService.syncParticipantsToFirebase(eventUID, eventID);
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('ikf:sync-brackets-to-firebase', async (_, eventUID: string, eventID: number) => {
  try {
    const result = await ikfService.syncBracketsToFirebase(eventUID, eventID);
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

// #endregion IKF Service IPC Handlers

// #endregion IPC Handlers
