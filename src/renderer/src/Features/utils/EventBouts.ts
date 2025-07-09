import { CSBout, CSBracket, CSMat } from "../../Models";

export function addBoutsFromBracket(bracket: CSBracket): CSBout[] {
  const bouts: CSBout[] = [];

  const { competitors, bracketId, matNumber } = bracket;
  switch (bracket.competitors.length) {
    case 2: {
      // create a single round one bout for two competitors
      bouts.push({
        boutId: `r1-${matNumber}-${bracketId}${competitors[0].participantId}-${competitors[1].participantId}`,
        bracketId: bracket.bracketId as number,
        matId: bracket.matNumber,
        roundNumber: 1,
        redCorner: bracket.competitors[0],
        blueCorner: bracket.competitors[1],
        winnerID: null,
        loserID: null,
        status: "notStarted",
      });
      break;
    }
    case 3: {
      // create a round one bout competitors with an index of 1 & 2 & a round two bout with competitor index 0 and a null blucorner
      bouts.push({
        boutId: `r1-${matNumber}-${bracketId}${competitors[1].participantId}-${competitors[2].participantId}`,
        bracketId: bracket.bracketId as number,
        matId: bracket.matNumber,
        roundNumber: 1,
        redCorner: bracket.competitors[1],
        blueCorner: bracket.competitors[2],
        winnerID: null,
        loserID: null,
        status: "notStarted",
      });
      bouts.push({
        boutId: `r2-${matNumber}-${bracketId}${competitors[0].participantId}-blueCorner`,
        bracketId: bracket.bracketId as number,
        matId: bracket.matNumber,
        roundNumber: 2,
        redCorner: bracket.competitors[0],
        blueCorner: null, // No blue corner for the second round
        winnerID: null,
        loserID: null,
        status: "notStarted",
      });
      break;
    }
    case 4: {
      // create two round one bouts for competitors with indices 0 & 1 and 2 & 3, then create two round two bouts with null bluecorner and redcorner
      bouts.push({
        boutId: `r1-${matNumber}-${bracketId}${competitors[0].participantId}-${competitors[1].participantId}`,
        bracketId: bracket.bracketId as number,
        matId: bracket.matNumber,
        roundNumber: 1,
        redCorner: bracket.competitors[0],
        blueCorner: bracket.competitors[1],
        winnerID: null,
        loserID: null,
        status: "notStarted",
      });
      bouts.push({
        boutId: `r1-${matNumber}-${bracketId}${competitors[2].participantId}-${competitors[3].participantId}`,
        bracketId: bracket.bracketId as number,
        matId: bracket.matNumber,
        roundNumber: 1,
        redCorner: bracket.competitors[2],
        blueCorner: bracket.competitors[3],
        winnerID: null,
        loserID: null,
        status: "notStarted",
      });
      bouts.push({
        boutId: `r2-${matNumber}-${bracketId}-semiFinal1`,
        bracketId: bracket.bracketId as number,
        matId: bracket.matNumber,
        roundNumber: 2,
        redCorner: null, // No red corner for the second round
        blueCorner: null, // No blue corner for the second round
        winnerID: null,
        loserID: null,
        status: "notStarted",
      });
      bouts.push({
        boutId: `r2-${matNumber}-${bracketId}-consolation1`,
        bracketId: bracket.bracketId as number,
        matId: bracket.matNumber,
        roundNumber: 2,
        redCorner: null, // No red corner for the second round
        blueCorner: null, // No blue corner for the second round
        winnerID: null,
        loserID: null,
        status: "notStarted",
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
  brackets.forEach((bracket) => {
    const bracketBouts = addBoutsFromBracket(bracket);
    bouts.push(...bracketBouts);
  });

  return bouts.sort((a, b) => a.roundNumber - b.roundNumber);
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
