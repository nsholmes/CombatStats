import { contextBridge, ipcRenderer } from "electron";
contextBridge.exposeInMainWorld("api", {
  //Expose a `window.api.readEventList` function to the renderer process.
  readEventList: () => {
    console.log(`Send IPC event to main process "read-file"`);
    ipcRenderer.send("read-event-list");
    return new Promise(
      (resolve) => ipcRenderer.once(
        "read-event-list-success",
        (event, data) => resolve({ event, data })
      )
    );
  },
  readEventParticipants: (eventUID, eventId) => {
    ipcRenderer.send("read-event-participants", eventUID, eventId);
    return new Promise(
      (resolve) => ipcRenderer.once("read-event-participants-success", (event, data) => {
        resolve({ event, data });
      })
    );
  },
  readEventBrackets: (eventUID, eventId) => {
    console.log("read-event-brackets", eventUID, eventId);
    ipcRenderer.send("read-event-brackets", eventUID, eventId);
    return new Promise(
      (resolve) => ipcRenderer.once("read-event-brackets-success", (event, data) => {
        resolve({ event, data });
      })
    );
  },
  refreshEventParticipantsFromFSI: (eventUID, eventId) => {
    console.log("refreshEventParticipants", eventUID, eventId);
    ipcRenderer.send("refresh-event-participants", eventUID, eventId);
    return new Promise(
      (resolve) => ipcRenderer.once("refresh-event-participants-success", (event, data) => {
        resolve({ event, data });
      })
    );
  }
});
