import {
  CSBout,
  CSBracket,
  CSMat,
} from "@nsholmes/combat-stats-types/event.model";
import { ref, set } from "firebase/database";
import { ikfpkbDB } from "../../FirebaseConfig";

export function addBoutsFromBracket(bracket: CSBracket): CSBout[] {
  const bouts: CSBout[] = [];

  const { competitors, bracketId, matNumber } = bracket;
  switch (bracket.competitors.length) {
    case 2: {
      // create a single round one bout for two competitors
      bouts.push({
        boutId: `r1-${bracketId}`,
        bracketId: bracket.bracketId as number,
        matId: bracket.matNumber,
        roundNumber: 1,
        redCorner: bracket.competitors[0],
        blueCorner: bracket.competitors[1],
        status: { state: "notStarted" },
        winner: null,
        roundWinner: [{ corner: null }, { corner: null }, { corner: null }],
      });
      break;
    }
    case 3: {
      // create a round one bout competitors with an index of 1 & 2 & a round two bout with competitor index 0 and a null blucorner
      bouts.push({
        boutId: `r1-${bracketId}`,
        bracketId: bracket.bracketId as number,
        matId: bracket.matNumber,
        roundNumber: 1,
        redCorner: bracket.competitors[1],
        blueCorner: bracket.competitors[2],
        status: { state: "notStarted" },
        winner: null,
        roundWinner: [{ corner: null }, { corner: null }, { corner: null }],
      });
      bouts.push({
        boutId: `r2-${bracketId}`,
        bracketId: bracket.bracketId as number,
        matId: bracket.matNumber,
        roundNumber: 2,
        redCorner: bracket.competitors[0],
        blueCorner: null, // No blue corner for the second round
        status: { state: "notStarted" },
        winner: null,
        roundWinner: [{ corner: null }, { corner: null }, { corner: null }],
      });
      break;
    }
    case 4: {
      // create two round one bouts for competitors with indices 0 & 1 and 2 & 3, then create two round two bouts with null bluecorner and redcorner
      bouts.push({
        boutId: `r1-${bracketId}`,
        bracketId: bracket.bracketId as number,
        matId: bracket.matNumber,
        roundNumber: 1,
        redCorner: bracket.competitors[0],
        blueCorner: bracket.competitors[1],
        status: { state: "notStarted" },
        winner: null,
        roundWinner: [{ corner: null }, { corner: null }, { corner: null }],
      });
      bouts.push({
        boutId: `r1-${bracketId}`,
        bracketId: bracket.bracketId as number,
        matId: bracket.matNumber,
        roundNumber: 1,
        redCorner: bracket.competitors[2],
        blueCorner: bracket.competitors[3],
        status: { state: "notStarted" },
        winner: null,
        roundWinner: [{ corner: null }, { corner: null }, { corner: null }],
      });
      bouts.push({
        boutId: `r2-${bracketId}-semiFinal1`,
        bracketId: bracket.bracketId as number,
        matId: bracket.matNumber,
        roundNumber: 2,
        redCorner: null, // No red corner for the second round
        blueCorner: null, // No blue corner for the second round
        status: { state: "notStarted" },
        winner: null,
        roundWinner: [{ corner: null }, { corner: null }, { corner: null }],
      });
      bouts.push({
        boutId: `r2-${bracketId}-consolation`,
        bracketId: bracket.bracketId as number,
        matId: bracket.matNumber,
        roundNumber: 2,
        redCorner: null, // No red corner for the second round
        blueCorner: null, // No blue corner for the second round
        status: { state: "notStarted" },
        winner: null,
        roundWinner: [{ corner: null }, { corner: null }, { corner: null }],
      });
      break;
    }
    default: {
      // Handle cases with more than 4 competitors or unexpected numbers
      console.warn(
        `Unexpected number of competitors: ${competitors.length} in bracket ${bracketId}`
      );
    }
  }
  return bouts;
}

export function createBracketBouts(brackets: CSBracket[]): CSBout[] {
  const bouts: CSBout[] = [];
  console.log("Creating bouts from brackets:", brackets.length);
  brackets.forEach((bracket) => {
    const bracketBouts = addBoutsFromBracket(bracket);
    bouts.push(...bracketBouts);
  });
  // write bout to firebase realtime database
  console.log("Generated bouts:", bouts.length);
  if (bouts.length === 0) {
    console.warn("No bouts generated from brackets.");
  }
  const sortedBouts = bouts.sort((a, b) => a.roundNumber - b.roundNumber);
  const db = ikfpkbDB();
  set(ref(db, "combatEvent/bouts"), sortedBouts)
    .then(() => {
      console.log("Bouts saved to Firebase Realtime Database successfully.");
      set(ref(db, "combatEvent/bracketOrderComitted"), true).then(() => {
        console.log("Bracket order committed successfully.");
      });
    })
    .catch((error) => {
      console.error(
        "Error saving bouts to Firebase Realtime Database:",
        error
      );
    });

  return sortedBouts;
}

export function matBrackets(
  brackets: CSBracket[],
  mats: CSMat[]
): { matId: number; matName: string; brackets: CSBracket[] }[] {
  return mats.map((mat) => ({
    matId: mat.id,
    matName: mat.name === "" ? `Mat ${mat.id}` : mat.name,
    brackets: brackets.filter((bracket) => bracket.matNumber === mat.id),
  }));
}
