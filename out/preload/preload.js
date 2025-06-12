"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("api", {
  //Expose a `window.api.readEventList` function to the renderer process.
  readEventList: () => {
    console.log(`Send IPC event to main process "read-file"`);
    electron.ipcRenderer.send("read-event-list");
    return new Promise(
      (resolve) => electron.ipcRenderer.once(
        "read-event-list-success",
        (event, data) => resolve({ event, data })
      )
    );
  },
  readEventParticipants: (eventUID, eventId) => {
    electron.ipcRenderer.send("read-event-participants", eventUID, eventId);
    return new Promise(
      (resolve) => electron.ipcRenderer.once("read-event-participants-success", (event, data) => {
        resolve({ event, data });
      })
    );
  },
  readEventBrackets: (eventUID, eventId) => {
    console.log("read-event-brackets", eventUID, eventId);
    electron.ipcRenderer.send("read-event-brackets", eventUID, eventId);
    return new Promise(
      (resolve) => electron.ipcRenderer.once("read-event-brackets-success", (event, data) => {
        resolve({ event, data });
      })
    );
  },
  refreshEventParticipantsFromFSI: (eventUID, eventId) => {
    console.log("refreshEventParticipants", eventUID, eventId);
    electron.ipcRenderer.send("refresh-event-participants", eventUID, eventId);
    return new Promise(
      (resolve) => electron.ipcRenderer.once("refresh-event-participants-success", (event, data) => {
        resolve({ event, data });
      })
    );
  }
});
