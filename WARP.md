# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

**CombatStats** is an Electron-based desktop application for managing combat sports tournaments, specifically focused on International Karate Federation (IKF) events. The application provides real-time event management, scoring, bracket organization, and integration with the Fight Sports Insider (FSI) API for data synchronization.

The app is built with **React**, **TypeScript**, **Redux**, **Material-UI**, and **Firebase Realtime Database** for real-time data sync across devices.

## Build and Development Commands

### Development
```bash
# Start Electron app in development mode (auto-reload)
npm run eDev

# Start Vite dev server for web view (without Electron)
npm run dev

# Preview Electron app
npm run ePreview
```

### Build
```bash
# Build Electron app
npm run eBuild

# Build web version (Vite)
npm run build

# TypeScript compilation happens automatically via vite build
```

### Firebase
```bash
# Serve Firebase hosting locally
npm run fbStart
```

### Linting
```bash
npm run lint
```

### Preview
```bash
# Preview production build (web)
npm run preview
```

## Architecture Overview

### Electron Multi-Process Architecture

CombatStats follows Electron's multi-process architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                       MAIN PROCESS                          │
│                    (src/main/main.ts)                       │
│                                                             │
│  • Window management                                        │
│  • IPC handlers for file I/O                               │
│  • IKFService instantiation                                │
│  • Firebase operations (via ikfService)                    │
└──────────────────┬──────────────────────────────────────────┘
                   │ IPC Communication
                   │ (via ipcMain ↔ ipcRenderer)
┌──────────────────┴──────────────────────────────────────────┐
│                     PRELOAD SCRIPT                          │
│                 (src/preload/preload.ts)                    │
│                                                             │
│  • Exposes safe API via contextBridge                      │
│  • window.api.* methods for renderer                       │
│  • window.api.ikf.* for IKF operations                     │
└──────────────────┬──────────────────────────────────────────┘
                   │
┌──────────────────┴──────────────────────────────────────────┐
│                   RENDERER PROCESS                          │
│               (src/renderer/src/)                           │
│                                                             │
│  • React application                                        │
│  • Redux state management                                  │
│  • Redux-Logic middleware for side effects                 │
│  • UI components and views                                 │
└─────────────────────────────────────────────────────────────┘
```

### State Management Architecture

The app uses **Redux Toolkit** with **Redux-Logic** middleware for async operations:

#### Redux Store Structure
Located in `src/renderer/src/store.ts`:

```typescript
{
  combatEvent: {
    // Current event being managed
    selectedEvent: IKFEvent,
    participants: IKFParticipant[],
    brackets: CSBracket[],
    bouts: CSBout[],
    mats: CSMat[],  // Competition mats with assigned bouts
  },
  CSBracket: {
    // Bracket-specific state
  },
  IKFEvents: {
    // Events slice (older implementation)
  },
  IKF: {
    // New IKF management slice
    events: IKFEvent[],
    participants: IKFParticipant[],
    brackets: EventBracket[],
    enrichmentProgress: {...},
    fetchAllProgress: {...},
    tokenValidation: {...},
  },
  ContextMenu: {...},
  Modals: {...}
}
```

#### Middleware Chain
Located in `src/renderer/src/store.ts`:

1. **fileUploadMiddleware** - Handles file upload logic
2. **eventsMiddleware** - Manages event operations
3. **combatEventMiddleware** - Handles combat event logic
4. **ikfMiddleware** - IKF API operations

Each middleware intercepts specific action types and performs async operations (API calls, file I/O), then dispatches success/failure actions.

### Data Flow Pattern

The application follows this data flow for IKF operations:

```
User Interaction (UI Component)
    ↓
Dispatch Action Creator (e.g., fetchEventsAction())
    ↓
Redux Logic Middleware Intercepts
    ↓
Call window.api.ikf.* (IPC to Main Process)
    ↓
Main Process IPC Handler
    ↓
IKFService Method (src/main/services/ikfService.ts)
    ↓
┌──────────────────┬──────────────────┐
│   FSI API Call   │  Local File I/O  │
└──────────────────┴──────────────────┘
    ↓
Response back through layers
    ↓
Dispatch Success/Failure Action
    ↓
Redux Reducer Updates State
    ↓
React Components Re-render
```

### Project Structure

```
CombatStats/
├── src/
│   ├── main/                        # Electron main process
│   │   ├── main.ts                  # Entry point, window management, IPC handlers
│   │   └── services/
│   │       └── ikfService.ts        # IKF API service layer
│   │
│   ├── preload/                     # Electron preload script
│   │   └── preload.ts               # Context bridge, API exposure
│   │
│   └── renderer/                    # React application
│       └── src/
│           ├── App.tsx              # Root component
│           ├── Router.tsx           # React Router configuration
│           ├── store.ts             # Redux store configuration
│           ├── FirebaseConfig.ts    # Firebase initialization
│           │
│           ├── Features/            # Redux slices + logic
│           │   ├── combatEvent.slice.ts    # Main event state
│           │   ├── combatEvent.logic.ts    # Event side effects
│           │   ├── combatEvent.actions.ts  # Action creators
│           │   ├── ikf.slice.ts            # IKF management state
│           │   ├── ikf.logic.ts            # IKF async operations
│           │   ├── ikf.actions.ts          # IKF action creators
│           │   ├── events.slice.ts         # Events state
│           │   ├── events.logic.ts         # Events side effects
│           │   ├── cbBracket.slice.ts      # Bracket state
│           │   ├── contextMenu.slice.ts    # Context menu state
│           │   ├── modal.slice.ts          # Modal state
│           │   └── fileUpload.logic.ts     # File upload operations
│           │
│           ├── Views/               # Page components
│           │   ├── Events.tsx              # Events list
│           │   ├── SelectedEventView.tsx   # Event details
│           │   ├── EventBrackets.tsx       # Bracket management
│           │   ├── EventBouts.tsx          # Bout listing
│           │   ├── EventResults.tsx        # Results display
│           │   ├── JudgesEntry.tsx         # Judge scoring interface
│           │   ├── UploadEvent.tsx         # Event upload
│           │   └── IKFManagement.tsx       # IKF data management UI
│           │
│           ├── Components/          # Reusable components
│           │   ├── HeaderNav.tsx           # Navigation header
│           │   └── contextMenus/
│           │       └── ContextMenu.tsx     # Right-click menus
│           │
│           ├── Models/              # Type definitions (if local)
│           ├── config/              # Configuration files
│           │   └── ikf.config.ts           # IKF API configuration
│           ├── utils/               # Utility functions
│           ├── data/                # Static data files
│           └── assets/              # Images, fonts, etc.
│
├── public/                          # Static assets
├── dist/                            # Compiled Electron app
├── out/                             # Electron build output
├── firebase.json                    # Firebase hosting config
├── electron.vite.config.ts          # Electron + Vite config
└── package.json
```

## Key Architectural Patterns

### 1. Shared Types via npm Package

The project uses **`@nsholmes/combat-stats-types`** package for shared TypeScript types across main and renderer processes:

```typescript
import { IKFEvent } from '@nsholmes/combat-stats-types/event.model';
import { IKFParticipant } from '@nsholmes/combat-stats-types/fighter.model';
import { EventBracket } from '@nsholmes/combat-stats-types/bracket.model';
```

This ensures type safety across process boundaries and prevents type drift.

### 2. IPC Communication Pattern

The preload script exposes a safe API to the renderer:

**Preload (src/preload/preload.ts):**
```typescript
contextBridge.exposeInMainWorld('api', {
  ikf: {
    fetchEvents: () => ipcRenderer.invoke('ikf:fetch-events'),
    onFetchAllProgress: (callback) => {
      ipcRenderer.on('ikf:fetch-all-participants-progress', (_, data) => callback(data));
    }
  }
});
```

**Main Process Handler (src/main/main.ts):**
```typescript
ipcMain.handle('ikf:fetch-events', async () => {
  const events = await ikfService.fetchEventsFromFSI();
  return { success: true, data: events };
});
```

**Redux Logic (src/renderer/src/Features/ikf.logic.ts):**
```typescript
process({ action }, dispatch, done) {
  window.api.ikf.fetchEvents()
    .then(result => {
      dispatch(setEvents(result.data));
    });
}
```

### 3. Progress Tracking Pattern

Long-running operations use IPC events for progress updates:

**Main Process:**
```typescript
event.sender.send('ikf:fetch-all-participants-progress', {
  current: i,
  total: events.length,
  eventName: event.eventName
});
```

**Preload:**
```typescript
onFetchAllProgress: (callback) => {
  ipcRenderer.on('ikf:fetch-all-participants-progress', (_, data) => callback(data));
  return () => ipcRenderer.removeAllListeners('ikf:fetch-all-participants-progress');
}
```

**React Component:**
```typescript
useEffect(() => {
  const cleanup = window.api.ikf.onFetchAllProgress((data) => {
    dispatch(setFetchAllProgress(data));
  });
  return cleanup;
}, []);
```

### 4. Mat Assignment System

The app manages multiple competition mats (rings) with bout assignments:

```typescript
type CSMat = {
  id: number;
  name: string;
  roles: {
    referee: string;
    judges: string[];
    timekeeper: string;
  };
  currentBoutId: number | null;    // Currently fighting
  onDeckBoutId: number | null;     // Next up
  inHoleBoutId: number | null;     // After on-deck
};
```

Bouts have statuses: `pending`, `inHole`, `onDeck`, `inProgress`, `completed`.

### 5. Firebase Real-Time Sync

The app uses Firebase RTDB for real-time synchronization:

**Structure:**
```
ikfpkb-midwest/
├── combatEvent/
│   ├── bouts/
│   ├── participants/
│   ├── brackets/
│   └── mats/
├── ikf/
│   ├── events/{eventId}
│   ├── eventParticipants/{eventId}/{competitorId}
│   └── eventBrackets/{eventId}/{bracketId}
```

Writes occur when state changes (see `combatEvent.slice.ts` reducers).

### 6. Local Data Caching

The IKFService caches data locally in `/Users/nazeerholmes/Desktop/Development/nhe-cli/data/`:

- `eventsSummary` - All events from FSI
- `eventParticipants/{eventUID}.{eventID}` - Per-event participants
- `eventBrackets/{eventUID}.{eventID}` - Per-event brackets
- `.profileIdCache.json` - Email → profileId mappings
- `.fsi_token` - FSI access token

**Important:** File paths are hardcoded to a specific machine. See `src/renderer/src/config/ikf.config.ts`:
```typescript
DATA_FILE_PATH: '/Users/nazeerholmes/Desktop/Development/nhe-cli/data/'
```

### 7. Drag-and-Drop System

The app uses **@dnd-kit** and **@atlaskit/pragmatic-drag-and-drop** for bracket reordering:

- Brackets can be reordered via drag-and-drop
- Bouts can be assigned to mats via drag-and-drop
- Participants can be assigned to brackets

## Routes and Navigation

Defined in `src/renderer/src/Router.tsx`:

```
/ (App shell with HeaderNav)
├── /events                           # Events list
├── /events/selectedEvent             # Event details view
├── /events/selectedEvent/brackets    # Bracket management
├── /uploadEvent                      # Upload event data
├── /judges                           # Judge scoring entry
├── /results                          # Event results
└── /ikf-management                   # IKF data management UI
```

Navigation is handled via `react-router-dom` with `HeaderNav.tsx` component.

## IKF Integration

### IKF Data Management UI

The `/ikf-management` route provides a tabbed interface:

1. **Events Tab**
   - Fetch events from FSI API
   - Reload from local cache
   - View event list with dates

2. **Participants Tab**
   - Select event from dropdown
   - Fetch participants for single event
   - Batch fetch ALL participants (with progress)
   - Enrich participants with profile IDs (with progress)
   - View participant details with badges

3. **Brackets Tab**
   - Select event from dropdown
   - Fetch brackets for event
   - View bracket details (weight class, discipline, fighters)

4. **Status Tab**
   - Validate FSI access token
   - Check participant data status
   - View events with/without participant data

### FSI API Integration

The `IKFService` class (`src/main/services/ikfService.ts`) handles all FSI API operations:

**Endpoints Used:**
- `GET /api/0.9/events` - Fetch events
- `GET /api/0.9/sesection/participants?uid={eventUID}` - Fetch participants
- `GET /api/0.9/se/eventbrackets?uid={eventUID}` - Fetch brackets
- `GET /api/0.9/search/people?keywords={email}` - Search for profile by email

**Authentication:**
- Bearer token stored in config and `.fsi_token` file
- Token can be updated via IPC: `window.api.ikf.updateToken(token)`

### Enrichment Process

Participant enrichment adds `profileId` field by searching FSI API by email:

1. Load cached email → profileId mappings from `.profileIdCache.json`
2. For each participant without profileId:
   - Check cache first
   - If not cached, call FSI search API
   - Cache result (success or null)
   - Add 300ms delay to avoid rate limiting
3. Update participant file with new profileIds
4. Save cache back to disk

This prevents duplicate API calls for participants appearing in multiple events.

## Development Workflow

### Adding a New Feature

1. **Define types** in `@nsholmes/combat-stats-types` package (if shared across processes)
2. **Main process:** Add IPC handler in `src/main/main.ts`
3. **Preload:** Expose API in `src/preload/preload.ts`
4. **Redux slice:** Define state and reducers in `src/renderer/src/Features/*.slice.ts`
5. **Redux logic:** Add async operations in `src/renderer/src/Features/*.logic.ts`
6. **Action creators:** Define in `src/renderer/src/Features/*.actions.ts`
7. **UI component:** Create view in `src/renderer/src/Views/` or component in `Components/`
8. **Route:** Add to `src/renderer/src/Router.tsx` if needed
9. **Navigation:** Update `HeaderNav.tsx` if adding to nav

### Testing IPC Communication

Use DevTools console (opened automatically in dev mode):

```javascript
// Test IKF API
window.api.ikf.fetchEvents().then(console.log);

// Test progress events
window.api.ikf.onFetchAllProgress((data) => {
  console.log('Progress:', data);
});
```

### Debugging

- **Main process logs:** Appear in terminal where `npm run eDev` was run
- **Renderer process logs:** Appear in Electron DevTools (auto-opens in dev mode)
- **Redux DevTools:** Use browser extension to inspect Redux state

### Working with Firebase

The app uses Firebase RTDB for real-time sync. To modify Firebase writes:

1. Import Firebase refs: `import { ref, set } from 'firebase/database'`
2. Get database instance: `const db = ikfpkbDB()` (from `FirebaseConfig.ts`)
3. Write data: `set(ref(db, 'path/to/data'), dataObject)`

Writes occur automatically in Redux reducers (see `combatEvent.slice.ts`).

## Important Considerations

### File Paths
The `DATA_FILE_PATH` in `src/renderer/src/config/ikf.config.ts` is **hardcoded** to:
```typescript
DATA_FILE_PATH: '/Users/nazeerholmes/Desktop/Development/nhe-cli/data/'
```

When working on different machines:
1. Update this path in `ikf.config.ts`
2. Ensure the directory exists
3. Run the nhe-cli to fetch initial data if needed

### Credentials
⚠️ **Security Warning:** The codebase contains hardcoded credentials:
- FSI API token in `src/renderer/src/config/ikf.config.ts`
- FSI email/password in same file
- These should be moved to environment variables

### Event UID Format
Event UIDs from FSI contain pipe characters (`|`) which are stripped when creating filenames:
```typescript
const fileName = `${eventUID.replace(/\|/g, '')}.${eventID}`;
```

### Participant ID Fields
Participants have multiple ID fields with distinct purposes:
- `personId` - FSI person entity ID
- `competitorId` - FSI competitor entity ID
- `participantId` - FSI event participation record ID
- `profileId` - Optional enriched FSI person profile ID (added via enrichment)

### Redux Persistence
Redux state is persisted to localStorage via `redux-persist` (see `store.ts`).
- Clear storage if state becomes corrupted
- Dev tools can clear persisted state

### Material-UI Theming
The app uses MUI components. When adding new components:
- Import from `@mui/material`
- Use MUI icons from `@mui/icons-material`
- Tailwind CSS is also available for custom styling

### API Rate Limiting
FSI API calls include delays (300-500ms) to avoid rate limiting. Don't remove these delays when batch processing.

## Common Tasks

### Adding a New Redux Slice
1. Create `featureName.slice.ts` with state and reducers
2. Create `featureName.actions.ts` with action creators
3. Create `featureName.logic.ts` with redux-logic handlers
4. Add slice to `store.ts` rootReducer
5. Add logic middleware to `store.ts` middleware array

### Adding a New IPC Channel
1. Add handler in `src/main/main.ts`:
   ```typescript
   ipcMain.handle('channel-name', async (event, ...args) => {
     // Handle logic
     return { success: true, data: result };
   });
   ```
2. Expose in `src/preload/preload.ts`:
   ```typescript
   channelName: (...args) => ipcRenderer.invoke('channel-name', ...args)
   ```
3. Call from renderer:
   ```typescript
   window.api.channelName(...args).then(result => {...});
   ```

### Updating FSI Access Token
1. Navigate to `/ikf-management` → Status tab
2. Click "Validate Token"
3. If invalid, get new token from FSI
4. Update in `src/renderer/src/config/ikf.config.ts`
5. Restart app or call `window.api.ikf.updateToken(newToken)`

### Adding a New View
1. Create component in `src/renderer/src/Views/ComponentName.tsx`
2. Add route in `Router.tsx`:
   ```tsx
   <Route path='new-route' element={<ComponentName />} />
   ```
3. Add navigation link in `HeaderNav.tsx` if needed
