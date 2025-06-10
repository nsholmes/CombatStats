import { BrowserWindow } from "electron";

export const createNewBracketWindow = (parentWindow: BrowserWindow) => {
  const { BrowserWindow } = require("electron").remote;

  let bracketWindow = new BrowserWindow({
    width: 400,
    height: 500,
    parent: parentWindow,
    modal: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });

  bracketWindow.loadURL("http://localhost:5173/judges");
  bracketWindow.on("closed", () => {
    bracketWindow = null;
  });

  return bracketWindow;
};
