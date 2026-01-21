import * as fs from 'fs';
import * as path from 'path';
import { initializeApp } from 'firebase/app';
import { Database, getDatabase, ref, set, get } from 'firebase/database';
import { IKF_CONFIG, getOptions } from '../config/ikf.config';

// Import types from combat-stats-types package
import { EventBracket } from '@nsholmes/combat-stats-types/bracket.model';
import { IKFEvent } from '@nsholmes/combat-stats-types/event.model';
import { IKFParticipant } from '@nsholmes/combat-stats-types/fighter.model';

// Type for enriched participant
export type EnrichedParticipant = IKFParticipant & {
  profileId?: number;
};

// Type for initial fighter response from FSI
type InitialFighter = {
  competitor: {
    id: number;
    weight: number;
    height: number;
  };
  create_date: string;
  id: number;
  person: {
    id: number;
    first_name: string;
    last_name: string;
    dob: string;
    email: string;
    gender: { name: string };
    contactinfo_list: {
      phones: Array<{ phone_number?: string }>;
    };
  };
  profile_name: string;
};

export class IKFService {
  private dataPath: string;
  private fbDatabase: Database | null = null;
  private accessToken: string;

  constructor() {
    this.dataPath = IKF_CONFIG.DATA_FILE_PATH;
    // Try to get token from localStorage first, fall back to config
    const storedToken = this.getStoredToken();
    this.accessToken = storedToken || IKF_CONFIG.FSI_ACCESS_TOKEN;
    this.ensureDirectories();
    this.initializeFirebase();
  }

  private getStoredToken(): string | null {
    // Try to read from a token file
    const tokenFilePath = path.join(this.dataPath, '.fsi_token');
    if (fs.existsSync(tokenFilePath)) {
      return fs.readFileSync(tokenFilePath, 'utf8').trim();
    }
    return null;
  }

  private saveToken(token: string): void {
    // Save token to a file for persistence
    const tokenFilePath = path.join(this.dataPath, '.fsi_token');
    fs.writeFileSync(tokenFilePath, token, 'utf8');
  }

  public updateAccessToken(token: string): void {
    this.accessToken = token;
    this.saveToken(token);
    console.log('Access token updated and saved');
  }

  public getAccessToken(): string {
    return this.accessToken;
  }

  private initializeFirebase(): void {
    try {
      const firebaseConfig = {
        databaseURL: IKF_CONFIG.FIREBASE_DATABASE_URL,
      };
      initializeApp(firebaseConfig);
      this.fbDatabase = getDatabase();
    } catch (error) {
      console.error('Failed to initialize Firebase:', error);
    }
  }

  private ensureDirectories(): void {
    const dirs = [
      this.dataPath,
      path.join(this.dataPath, 'eventParticipants'),
      path.join(this.dataPath, 'eventBrackets'),
    ];

    dirs.forEach((dir) => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  // ===== EVENT METHODS =====

  async fetchEventsFromFSI(): Promise<IKFEvent[]> {
    const promoterIds = JSON.stringify(IKF_CONFIG.PROMOTER_IDS);
    const url = `${IKF_CONFIG.FSI_BASE_URL}events?count=${IKF_CONFIG.RESPONSE_COUNT}&promoter_ids=${promoterIds}&date_from=${IKF_CONFIG.DATE_FROM}&is_draft=${IKF_CONFIG.IS_DRAFT}`;

    const response = await fetch(url, {
      ...getOptions,
      headers: {
        ...getOptions.headers,
        Authorization: this.accessToken,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.statusText}`);
    }

    const data = await response.json();
    const events: IKFEvent[] = data.sporting_events
      .filter((sEvent: any) => sEvent.promoter?.id && sEvent.id)
      .map((sEvent: any) => ({
        eventDate: sEvent.event_date,
        id: sEvent.id,
        eventName: sEvent.name,
        posterUrl: sEvent.poster,
        posterSmallUrl: sEvent.poster_small,
        promoterId: sEvent.promoter.id,
        registrationFee: sEvent.registration_fee,
        trainerRegistrationFee: sEvent.trainer_registration_fee,
        eventUid: sEvent.uid,
      }));

    // Write to file
    fs.writeFileSync(
      path.join(this.dataPath, 'eventsSummary'),
      JSON.stringify(events, null, 2)
    );

    return events;
  }

  readEventsFromFile(): IKFEvent[] {
    const filePath = path.join(this.dataPath, 'eventsSummary');
    if (!fs.existsSync(filePath)) {
      return [];
    }

    const fileData = fs.readFileSync(filePath, 'utf8');
    const events: IKFEvent[] = JSON.parse(fileData);
    
    // Sort by date descending
    return events.sort((a, b) => {
      const aDate = new Date(a.eventDate);
      const bDate = new Date(b.eventDate);
      return bDate.getTime() - aDate.getTime();
    });
  }

  // ===== PARTICIPANT METHODS =====

  async fetchEventParticipants(
    eventUID: string,
    eventID: number
  ): Promise<IKFParticipant[]> {
    const url = `${IKF_CONFIG.FSI_BASE_URL2}sesection/participants?uid=${eventUID}`;

    const response = await fetch(url, {
      ...getOptions,
      headers: {
        ...getOptions.headers,
        Authorization: this.accessToken,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch participants: ${response.statusText}`);
    }

    const data = await response.json();
    const FSIParticipants: InitialFighter[] = data.seps || [];

    const participants: IKFParticipant[] = FSIParticipants.map(
      (participant) => ({
        competitorId: participant.competitor.id,
        participantId: participant.id,
        personId: participant.person.id,
        createDate: participant.create_date,
        firstName: participant.person.first_name,
        lastName: participant.person.last_name,
        dob: participant.person.dob,
        email: participant.person.email,
        gender: participant.person.gender.name,
        weight: participant.competitor.weight,
        height: participant.competitor.height,
        profileName: participant.profile_name,
        phoneNumber:
          participant.person.contactinfo_list.phones[0]?.phone_number || '',
        bracketCount: 0,
        checkedIn: false,
      })
    );

    // Write to file
    const fileName = `${eventUID.replace(/\|/g, '')}.${eventID}`;
    const filePath = path.join(this.dataPath, 'eventParticipants', fileName);
    fs.writeFileSync(filePath, JSON.stringify(participants, null, 2));

    return participants;
  }

  readParticipantsFromFile(eventUID: string, eventID: number): IKFParticipant[] {
    const fileName = `${eventUID.replace(/\|/g, '')}.${eventID}`;
    const filePath = path.join(this.dataPath, 'eventParticipants', fileName);

    if (!fs.existsSync(filePath)) {
      return [];
    }

    const fileData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileData);
  }

  async fetchAllParticipants(
    onProgress?: (current: number, total: number, eventName: string) => void
  ): Promise<{ success: number; skipped: number; errors: number }> {
    const events = this.readEventsFromFile();
    const participantsDir = path.join(this.dataPath, 'eventParticipants');

    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;

    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      const fileName = `${event.eventUid.replace(/\|/g, '')}.${event.id}`;
      const filePath = path.join(participantsDir, fileName);

      if (fs.existsSync(filePath)) {
        skippedCount++;
        continue;
      }

      if (onProgress) {
        onProgress(i + 1, events.length, event.eventName);
      }

      try {
        await this.fetchEventParticipants(event.eventUid, event.id);
        successCount++;
        
        // Small delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Error fetching participants for event ${event.id}:`, error);
        errorCount++;
      }
    }

    return { success: successCount, skipped: skippedCount, errors: errorCount };
  }

  /**
   * Get all participants across all events without duplicates
   * Deduplicates by competitorId and includes event count
   */
  getAllParticipantsAcrossEvents(): Array<IKFParticipant & { eventCount: number; eventIds: number[] }> {
    const participantsDir = path.join(this.dataPath, 'eventParticipants');
    const events = this.readEventsFromFile();
    
    if (!fs.existsSync(participantsDir)) {
      return [];
    }

    const participantFiles = fs.readdirSync(participantsDir);
    const participantMap = new Map<number, IKFParticipant & { eventCount: number; eventIds: number[] }>();

    // Create a map of filename to event for event ID lookup
    const eventMap = new Map<string, IKFEvent>();
    events.forEach(event => {
      const fileName = `${event.eventUid.replace(/\|/g, '')}.${event.id}`;
      eventMap.set(fileName, event);
    });

    for (const file of participantFiles) {
      const filePath = path.join(participantsDir, file);
      if (!fs.statSync(filePath).isFile()) continue;

      try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const participants: IKFParticipant[] = JSON.parse(fileContent);
        const event = eventMap.get(file);
        const eventId = event?.id || -1;

        for (const participant of participants) {
          const existing = participantMap.get(participant.competitorId);
          
          if (existing) {
            // Participant already exists, increment event count
            existing.eventCount++;
            if (eventId !== -1 && !existing.eventIds.includes(eventId)) {
              existing.eventIds.push(eventId);
            }
          } else {
            // New participant
            participantMap.set(participant.competitorId, {
              ...participant,
              eventCount: 1,
              eventIds: eventId !== -1 ? [eventId] : [],
            });
          }
        }
      } catch (error) {
        console.error(`Error reading participant file ${file}:`, error);
      }
    }

    // Convert map to array and sort by last name
    return Array.from(participantMap.values()).sort((a, b) => {
      const lastNameCompare = a.lastName.localeCompare(b.lastName);
      if (lastNameCompare !== 0) return lastNameCompare;
      return a.firstName.localeCompare(b.firstName);
    });
  }

  // ===== BRACKET METHODS =====

  async fetchEventBrackets(
    eventUID: string,
    eventID: number
  ): Promise<EventBracket[]> {
    const url = `${IKF_CONFIG.FSI_BASE_URL2}se/eventbrackets?uid=${eventUID}&obps=True&e=1`;

    const response = await fetch(url, {
      ...getOptions,
      headers: {
        ...getOptions.headers,
        Authorization: this.accessToken,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch brackets: ${response.statusText}`);
    }

    const data = await response.json();
    const brackets: EventBracket[] = data.brackets.map((bracket: any) => ({
      belt: bracket.belt ? true : false,
      bracketrule: {
        description: bracket.bracketrule.description,
        id: bracket.bracketrule.id,
        name: bracket.bracketrule.name,
        friendly_name: bracket.bracketrule.friendly_name,
      },
      bracketstatus: {
        id: bracket.bracketstatus.id,
        name: bracket.bracketstatus.name,
        friendly_name: bracket.bracketstatus.friendly_name,
      },
      compete_class_weight: {
        id: bracket.compete_class_weight.id,
        name: bracket.compete_class_weight.name,
        min: bracket.compete_class_weight.min,
        max: bracket.compete_class_weight.max,
      },
      criteria: bracket.criteria,
      discipline: {
        id: bracket.discipline.id,
        name: bracket.discipline.name,
      },
      group: bracket.group,
      id: bracket.id,
      name: bracket.name,
      number: bracket.number,
      result_summary: bracket.result_summary || '',
      ring_name: bracket.ring_name || '',
      ring_number: bracket.ring_number || 0,
      fighterIds: bracket.seps.map((sep: any) => sep.competitor.id),
      fighterGym: bracket.seps.map((sep: any) => ({
        competitorId: sep.competitor.id,
        gymName: sep.gym_name,
      })),
    }));

    // Write to file
    const fileName = `${eventUID.replace(/\|/g, '')}.${eventID}`;
    const filePath = path.join(this.dataPath, 'eventBrackets', fileName);
    fs.writeFileSync(filePath, JSON.stringify(brackets, null, 2));

    return brackets;
  }

  readBracketsFromFile(eventUID: string, eventID: number): EventBracket[] {
    const fileName = `${eventUID.replace(/\|/g, '')}.${eventID}`;
    const filePath = path.join(this.dataPath, 'eventBrackets', fileName);

    if (!fs.existsSync(filePath)) {
      return [];
    }

    const fileData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileData);
  }

  // ===== ENRICHMENT METHODS =====

  async enrichParticipantsWithProfileId(
    eventId?: string,
    forceUpdate?: boolean,
    onProgress?: (current: number, total: number, participantName: string) => void
  ): Promise<{
    total: number;
    enriched: number;
    alreadyEnriched: number;
    failed: number;
    noEmail: number;
  }> {
    const participantsDir = path.join(this.dataPath, 'eventParticipants');
    const cacheFilePath = path.join(this.dataPath, '.profileIdCache.json');

    // Load cache
    const profileIdCache = new Map<string, number | null>();
    if (!forceUpdate && fs.existsSync(cacheFilePath)) {
      const cacheData = JSON.parse(fs.readFileSync(cacheFilePath, 'utf8'));
      Object.entries(cacheData).forEach(([email, profileId]) => {
        profileIdCache.set(email, profileId as number | null);
      });
    }

    // Get participant files
    let participantFiles: string[] = [];
    if (eventId) {
      const allFiles = fs.readdirSync(participantsDir);
      participantFiles = allFiles.filter((file) => file.includes(eventId));
    } else {
      participantFiles = fs.readdirSync(participantsDir);
    }

    let totalParticipants = 0;
    let enrichedCount = 0;
    let alreadyEnriched = 0;
    let failedCount = 0;
    let noEmailCount = 0;

    for (const file of participantFiles) {
      const filePath = path.join(participantsDir, file);
      if (!fs.statSync(filePath).isFile()) continue;

      const fileContent = fs.readFileSync(filePath, 'utf8');
      const participants: EnrichedParticipant[] = JSON.parse(fileContent);
      totalParticipants += participants.length;

      let updated = false;

      for (let i = 0; i < participants.length; i++) {
        const participant = participants[i];

        if (participant.profileId && !forceUpdate) {
          alreadyEnriched++;
          continue;
        }

        if (!participant.email || participant.email.trim() === '') {
          noEmailCount++;
          continue;
        }

        if (onProgress) {
          onProgress(
            i + 1,
            participants.length,
            `${participant.firstName} ${participant.lastName}`
          );
        }

        const emailLower = participant.email.toLowerCase().trim();

        // Check cache
        if (profileIdCache.has(emailLower)) {
          const cachedId = profileIdCache.get(emailLower);
          if (cachedId) {
            participants[i].profileId = cachedId;
            enrichedCount++;
            updated = true;
          } else {
            failedCount++;
          }
          continue;
        }

        // Fetch from API
        try {
          const profileId = await this.searchProfileByEmail(participant.email);
          profileIdCache.set(emailLower, profileId);

          if (profileId) {
            participants[i].profileId = profileId;
            enrichedCount++;
            updated = true;
          } else {
            failedCount++;
          }

          // Small delay to avoid rate limiting
          await new Promise((resolve) => setTimeout(resolve, 300));
        } catch (error) {
          console.error(`Error enriching participant ${participant.email}:`, error);
          failedCount++;
        }
      }

      if (updated) {
        fs.writeFileSync(filePath, JSON.stringify(participants, null, 2));
      }
    }

    // Save cache
    const cacheData: Record<string, number | null> = {};
    profileIdCache.forEach((value, key) => {
      cacheData[key] = value;
    });
    fs.writeFileSync(cacheFilePath, JSON.stringify(cacheData, null, 2));

    return {
      total: totalParticipants,
      enriched: enrichedCount,
      alreadyEnriched,
      failed: failedCount,
      noEmail: noEmailCount,
    };
  }

  private async searchProfileByEmail(email: string): Promise<number | null> {
    if (!email || email.trim() === '') {
      return null;
    }

    const url = `${IKF_CONFIG.FSI_BASE_URL2}search/people?takecount=10&keywords=${email}`;

    try {
      const response = await fetch(url, {
        ...getOptions,
        headers: {
          ...getOptions.headers,
          Authorization: this.accessToken,
        },
      });

      if (response.status === 204) {
        return null;
      }

      if (response.ok) {
        const data = await response.json();
        const results: any[] = data || [];
        const emailLower = email.toLowerCase().trim();

        const match = results.find(
          (result) => result.email?.toLowerCase() === emailLower
        );

        return match ? match.id : null;
      }

      return null;
    } catch (error) {
      console.error(`Error searching for ${email}:`, error);
      return null;
    }
  }

  // ===== STATUS METHODS =====

  getParticipantStatus(): {
    eventsWithParticipants: string[];
    eventsWithoutParticipants: string[];
  } {
    const events = this.readEventsFromFile();
    const participantsDir = path.join(this.dataPath, 'eventParticipants');

    const eventsWithParticipants: string[] = [];
    const eventsWithoutParticipants: string[] = [];

    events.forEach((event) => {
      const fileName = `${event.eventUid.replace(/\|/g, '')}.${event.id}`;
      const filePath = path.join(participantsDir, fileName);

      if (fs.existsSync(filePath)) {
        eventsWithParticipants.push(`${event.eventName} (${event.id})`);
      } else {
        eventsWithoutParticipants.push(`${event.eventName} (${event.id})`);
      }
    });

    return { eventsWithParticipants, eventsWithoutParticipants };
  }

  async validateToken(): Promise<{ valid: boolean; message: string }> {
    try {
      const url = `${IKF_CONFIG.FSI_BASE_URL2}sesection/participants?uid=test`;
      const response = await fetch(url, {
        ...getOptions,
        headers: {
          ...getOptions.headers,
          Authorization: this.accessToken,
        },
      });

      if (response.status === 401) {
        return { valid: false, message: 'Token is invalid or expired' };
      }

      return { valid: true, message: 'Token is valid' };
    } catch (error) {
      return { valid: false, message: `Error validating token: ${error}` };
    }
  }

  // ===== FIREBASE SYNC METHODS =====

  async syncEventsToFirebase(
    onProgress?: (current: number, total: number, eventName: string) => void
  ): Promise<{ success: number; errors: number }> {
    if (!this.fbDatabase) {
      throw new Error('Firebase not initialized');
    }

    const events = this.readEventsFromFile();
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < events.length; i++) {
      const event = events[i];

      if (onProgress) {
        onProgress(i + 1, events.length, event.eventName);
      }

      try {
        await set(ref(this.fbDatabase, `ikf/events/${event.id}`), event);
        successCount++;
      } catch (error) {
        console.error(`Failed to sync event ${event.id}:`, error);
        errorCount++;
      }
    }

    return { success: successCount, errors: errorCount };
  }

  async syncParticipantsToFirebase(
    eventUID: string,
    eventID: number
  ): Promise<{ success: number; errors: number }> {
    if (!this.fbDatabase) {
      throw new Error('Firebase not initialized');
    }

    const participants = this.readParticipantsFromFile(eventUID, eventID);
    let successCount = 0;
    let errorCount = 0;

    for (const participant of participants) {
      try {
        await set(
          ref(
            this.fbDatabase,
            `ikf/eventParticipants/${eventID}/${participant.competitorId}`
          ),
          participant
        );
        successCount++;
      } catch (error) {
        console.error(
          `Failed to sync participant ${participant.competitorId}:`,
          error
        );
        errorCount++;
      }
    }

    return { success: successCount, errors: errorCount };
  }

  async syncBracketsToFirebase(
    eventUID: string,
    eventID: number
  ): Promise<{ success: number; errors: number }> {
    if (!this.fbDatabase) {
      throw new Error('Firebase not initialized');
    }

    const brackets = this.readBracketsFromFile(eventUID, eventID);
    let successCount = 0;
    let errorCount = 0;

    for (const bracket of brackets) {
      try {
        await set(
          ref(this.fbDatabase, `ikf/eventBrackets/${eventID}/${bracket.id}`),
          bracket
        );
        successCount++;
      } catch (error) {
        console.error(`Failed to sync bracket ${bracket.id}:`, error);
        errorCount++;
      }
    }

    return { success: successCount, errors: errorCount };
  }

  // ===== FIREBASE QUERY METHODS =====

  /**
   * Get comprehensive Firebase details for a participant
   * Includes bouts, wins/losses, events participated in, and gym name
   */
  async getParticipantFirebaseDetails(competitorId: number): Promise<{
    participant: IKFParticipant | null;
    bouts: Array<{
      boutId: string;
      eventId: number;
      eventName: string;
      opponent: string;
      result: 'won' | 'lost' | 'pending';
      corner: 'red' | 'blue';
    }>;
    wins: number;
    losses: number;
    events: Array<{ id: number; name: string }>;
    gymName: string | null;
  }> {
    if (!this.fbDatabase) {
      throw new Error('Firebase not initialized');
    }

    const result = {
      participant: null as IKFParticipant | null,
      bouts: [] as Array<{
        boutId: string;
        eventId: number;
        eventName: string;
        opponent: string;
        result: 'won' | 'lost' | 'pending';
        corner: 'red' | 'blue';
      }>,
      wins: 0,
      losses: 0,
      events: [] as Array<{ id: number; name: string }>,
      gymName: null as string | null,
    };

    try {
      // Get all events to build event name map
      const events = this.readEventsFromFile();
      const eventMap = new Map<number, IKFEvent>();
      events.forEach(event => eventMap.set(event.id, event));

      // Find participant in local files
      const participantsDir = path.join(this.dataPath, 'eventParticipants');
      if (fs.existsSync(participantsDir)) {
        const files = fs.readdirSync(participantsDir);
        for (const file of files) {
          const filePath = path.join(participantsDir, file);
          if (!fs.statSync(filePath).isFile()) continue;
          
          const participants: IKFParticipant[] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          const found = participants.find(p => p.competitorId === competitorId);
          if (found && !result.participant) {
            result.participant = found;
          }
        }
      }

      // Query Firebase for bouts
      const boutsRef = ref(this.fbDatabase, 'combatEvent/bouts');
      const boutsSnapshot = await get(boutsRef);
      
      if (boutsSnapshot.exists()) {
        const bouts = boutsSnapshot.val();
        const boutArray = Array.isArray(bouts) ? bouts : Object.values(bouts);

        boutArray.forEach((bout: any) => {
          if (!bout) return;

          let isParticipant = false;
          let corner: 'red' | 'blue' | null = null;
          let opponent = 'Unknown';
          let boutResult: 'won' | 'lost' | 'pending' = 'pending';

          // Check if participant is in this bout
          if (bout.redCorner && bout.redCorner.competitorId === competitorId) {
            isParticipant = true;
            corner = 'red';
            opponent = bout.blueCorner 
              ? `${bout.blueCorner.firstName} ${bout.blueCorner.lastName}`
              : 'Unknown';
          } else if (bout.blueCorner && bout.blueCorner.competitorId === competitorId) {
            isParticipant = true;
            corner = 'blue';
            opponent = bout.redCorner
              ? `${bout.redCorner.firstName} ${bout.redCorner.lastName}`
              : 'Unknown';
          }

          if (isParticipant && corner) {
            // Determine result
            if (bout.winner && bout.winner.boutWinnerId) {
              if (bout.winner.boutWinnerId === competitorId) {
                boutResult = 'won';
                result.wins++;
              } else {
                boutResult = 'lost';
                result.losses++;
              }
            }

            // Get event info
            const eventId = bout.bracketId ? parseInt(String(bout.bracketId)) : -1;
            const event = eventMap.get(eventId);
            const eventName = event?.eventName || 'Unknown Event';

            // Add event to events list if not already there
            if (event && !result.events.find(e => e.id === event.id)) {
              result.events.push({ id: event.id, name: event.eventName });
            }

            result.bouts.push({
              boutId: bout.boutId,
              eventId,
              eventName,
              opponent,
              result: boutResult,
              corner,
            });
          }
        });
      }

      // Get gym name from bracket data
      const bracketsDir = path.join(this.dataPath, 'eventBrackets');
      if (fs.existsSync(bracketsDir)) {
        const files = fs.readdirSync(bracketsDir);
        for (const file of files) {
          const filePath = path.join(bracketsDir, file);
          if (!fs.statSync(filePath).isFile()) continue;
          
          const brackets: EventBracket[] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          for (const bracket of brackets) {
            if (bracket.fighterGym) {
              const gymEntry = bracket.fighterGym.find(
                (fg: any) => fg.competitorId === competitorId
              );
              if (gymEntry && gymEntry.gymName) {
                result.gymName = gymEntry.gymName;
                break;
              }
            }
          }
          if (result.gymName) break;
        }
      }

    } catch (error) {
      console.error('Error getting participant Firebase details:', error);
      throw error;
    }

    return result;
  }
}
