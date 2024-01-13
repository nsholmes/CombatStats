export type CSEvent = {
    overview: EventOverview;
    bouts: Bout[];
}

export type EventOverview = {
    eventID?: number;
    eventName: string;
    date: string;
    promoter: string;
    location?: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: number;
}

export type Bout = {
    redCorner: Fighter;
    blueCorner: Fighter;
    results: {
        type: Decision | Finish;
        winner: number; //fighterId
        loser: number; //fighterId
    },
    stats: {
        redStats: FighterStats;
        blueStats: FighterStats;
    }
}

export type Fighter = {
    id: number;
    firstName: string;
    lastName: string;
    age: number;
    dob: string
    weight: number;
    homeTown: string;
    gym: string;
    record: FighterRecord;
}

export type FighterStats = {
    attempted: Strikes;
    landed: Strikes;
}

export type Strikes = {
    headPunches: number;
    headKicks: number;
    bodyPunches: number;
    bodyKicks: number;
    legKicks: number;
    sweeps: number;
}

//Split or Unanimous
export type Decision = {
    title: string;
    score1: number;
    score2: number;
    score3: number;
}

// TKO or KO
export type Finish = {
    title: string;
    time: string;
    round: number;
}

// All time Record
export type FighterRecord = {
    wins: number;
    loses: number;
    noContests?: number;
}


