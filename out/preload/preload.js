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
  },
  // IKF Management API
  ikf: {
    // Events
    fetchEvents: () => electron.ipcRenderer.invoke("ikf:fetch-events"),
    readEvents: () => electron.ipcRenderer.invoke("ikf:read-events"),
    // Participants
    fetchParticipants: (eventUID, eventID) => electron.ipcRenderer.invoke("ikf:fetch-participants", eventUID, eventID),
    readParticipants: (eventUID, eventID) => electron.ipcRenderer.invoke("ikf:read-participants", eventUID, eventID),
    fetchAllParticipants: () => electron.ipcRenderer.invoke("ikf:fetch-all-participants"),
    onFetchAllProgress: (callback) => {
      electron.ipcRenderer.on("ikf:fetch-all-participants-progress", (_, data) => callback(data));
      return () => electron.ipcRenderer.removeAllListeners("ikf:fetch-all-participants-progress");
    },
    // Brackets
    fetchBrackets: (eventUID, eventID) => electron.ipcRenderer.invoke("ikf:fetch-brackets", eventUID, eventID),
    readBrackets: (eventUID, eventID) => electron.ipcRenderer.invoke("ikf:read-brackets", eventUID, eventID),
    // Enrichment
    enrichParticipants: (eventId, forceUpdate) => electron.ipcRenderer.invoke("ikf:enrich-participants", eventId, forceUpdate),
    onEnrichProgress: (callback) => {
      electron.ipcRenderer.on("ikf:enrich-participants-progress", (_, data) => callback(data));
      return () => electron.ipcRenderer.removeAllListeners("ikf:enrich-participants-progress");
    },
    // Status
    getParticipantStatus: () => electron.ipcRenderer.invoke("ikf:get-participant-status"),
    validateToken: () => electron.ipcRenderer.invoke("ikf:validate-token"),
    updateToken: (token) => electron.ipcRenderer.invoke("ikf:update-token", token),
    // Firebase Sync
    syncEventsToFirebase: () => electron.ipcRenderer.invoke("ikf:sync-events-to-firebase"),
    onSyncEventsProgress: (callback) => {
      electron.ipcRenderer.on("ikf:sync-events-progress", (_, data) => callback(data));
      return () => electron.ipcRenderer.removeAllListeners("ikf:sync-events-progress");
    },
    syncParticipantsToFirebase: (eventUID, eventID) => electron.ipcRenderer.invoke("ikf:sync-participants-to-firebase", eventUID, eventID),
    syncBracketsToFirebase: (eventUID, eventID) => electron.ipcRenderer.invoke("ikf:sync-brackets-to-firebase", eventUID, eventID)
  }
});
