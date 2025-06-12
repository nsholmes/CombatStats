import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("api", {
  //Expose a `window.api.readEventList` function to the renderer process.
  readEventList: () => {
    // Send IPC event to main process "read-file"
    console.log(`Send IPC event to main process "read-file"`);
    ipcRenderer.send("read-event-list");

    // Create a promise that resolves when the "read-event-list" event is received.
    // That event is sent from the main process when the file has been successfully read.
    return new Promise((resolve) =>
      ipcRenderer.once("read-event-list-success", (event, data) =>
        resolve({ event, data })
      )
    );
  },
  readEventParticipants: (eventUID: string, eventId: number) => {
    ipcRenderer.send("read-event-participants", eventUID, eventId);
    return new Promise((resolve) =>
      ipcRenderer.once("read-event-participants-success", (event, data) => {
        resolve({ event, data });
      })
    );
  },
  readEventBrackets: (eventUID: string, eventId: number) => {
    console.log("read-event-brackets", eventUID, eventId);
    ipcRenderer.send("read-event-brackets", eventUID, eventId);
    return new Promise((resolve) =>
      ipcRenderer.once("read-event-brackets-success", (event, data) => {
        resolve({ event, data });
      })
    );
  },

  refreshEventParticipantsFromFSI: (eventUID: string, eventId: number) => {
    console.log("refreshEventParticipants", eventUID, eventId);
    ipcRenderer.send("refresh-event-participants", eventUID, eventId);
    return new Promise((resolve) =>
      ipcRenderer.once("refresh-event-participants-success", (event, data) => {
        resolve({ event, data });
      })
    );
  },
});
