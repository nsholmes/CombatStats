/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly GET_ALL_COMBAT_EVENTS: string;
  readonly CREATE_NEW_COMBAT_EVENT: string;
  readonly ADD_PARTICIPANT_TO_EVENT: string;
  readonly UPLOAD_COMBAT_EVENT_FILE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}