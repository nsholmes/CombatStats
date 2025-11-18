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

  // IKF Management API
  ikf: {
    // Events
    fetchEvents: () => ipcRenderer.invoke('ikf:fetch-events'),
    readEvents: () => ipcRenderer.invoke('ikf:read-events'),

    // Participants
    fetchParticipants: (eventUID: string, eventID: number) =>
      ipcRenderer.invoke('ikf:fetch-participants', eventUID, eventID),
    readParticipants: (eventUID: string, eventID: number) =>
      ipcRenderer.invoke('ikf:read-participants', eventUID, eventID),
    fetchAllParticipants: () => ipcRenderer.invoke('ikf:fetch-all-participants'),
    onFetchAllProgress: (callback: (data: any) => void) => {
      ipcRenderer.on('ikf:fetch-all-participants-progress', (_, data) => callback(data));
      return () => ipcRenderer.removeAllListeners('ikf:fetch-all-participants-progress');
    },

    // Brackets
    fetchBrackets: (eventUID: string, eventID: number) =>
      ipcRenderer.invoke('ikf:fetch-brackets', eventUID, eventID),
    readBrackets: (eventUID: string, eventID: number) =>
      ipcRenderer.invoke('ikf:read-brackets', eventUID, eventID),

    // Enrichment
    enrichParticipants: (eventId?: string, forceUpdate?: boolean) =>
      ipcRenderer.invoke('ikf:enrich-participants', eventId, forceUpdate),
    onEnrichProgress: (callback: (data: any) => void) => {
      ipcRenderer.on('ikf:enrich-participants-progress', (_, data) => callback(data));
      return () => ipcRenderer.removeAllListeners('ikf:enrich-participants-progress');
    },

    // Status
    getParticipantStatus: () => ipcRenderer.invoke('ikf:get-participant-status'),
    validateToken: () => ipcRenderer.invoke('ikf:validate-token'),
    updateToken: (token: string) => ipcRenderer.invoke('ikf:update-token', token),

    // Firebase Sync
    syncEventsToFirebase: () => ipcRenderer.invoke('ikf:sync-events-to-firebase'),
    onSyncEventsProgress: (callback: (data: any) => void) => {
      ipcRenderer.on('ikf:sync-events-progress', (_, data) => callback(data));
      return () => ipcRenderer.removeAllListeners('ikf:sync-events-progress');
    },
    syncParticipantsToFirebase: (eventUID: string, eventID: number) =>
      ipcRenderer.invoke('ikf:sync-participants-to-firebase', eventUID, eventID),
    syncBracketsToFirebase: (eventUID: string, eventID: number) =>
      ipcRenderer.invoke('ikf:sync-brackets-to-firebase', eventUID, eventID),
  },
});
