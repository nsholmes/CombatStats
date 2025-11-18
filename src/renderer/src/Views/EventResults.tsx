import { grp1 } from "../data/ResultsGroup1";
import { grp2 } from "../data/ResultsGroup2";

function getWinnerName(bout: any) {
  if (!bout.winner_corner_color) return "Draw";
  if (bout.winner_corner_color === "red") return bout.competitor_1_name;
  if (bout.winner_corner_color === "blue") return bout.competitor_2_name;
  return "Unknown";
}

function getLoserName(bout: any) {
  if (!bout.winner_corner_color) return "Draw";
  if (bout.winner_corner_color === "red") return bout.competitor_2_name;
  if (bout.winner_corner_color === "blue") return bout.competitor_1_name;
  return "Unknown";
}

function groupBoutsByBracketId(bouts: any[]) {
  const grouped: Record<string, any[]> = {};
  bouts.forEach((bout) => {
    const id = bout.bracket_id;
    if (!grouped[id]) grouped[id] = [];
    grouped[id].push(bout);
  });
  return grouped;
}

function EventResults() {
  const { bracketList } = grp1;
  const bracketList2 = grp2.bracketList;

  // Collect all bouts and group by bracket_id
  const allBouts = bracketList
    .map((bracket) => bracket.bouts)
    .filter(Array.isArray)
    .flat();

  const allBouts2 = bracketList2
    .map((bracket) => bracket.bouts)
    .filter(Array.isArray)
    .flat();
  const boutsByBracketId = groupBoutsByBracketId(allBouts);
  const boutsByBracketId2 = groupBoutsByBracketId(allBouts2);

  return (
    <div className="p-4">
      <h2>RESULTS</h2>
      <h2>GROUP 1</h2>
      {Object.entries(boutsByBracketId).map(([bracketId, bouts]) => (
        <div key={bracketId} className="mb-6">
          <h3>Bracket ID: {bracketId}</h3>
          <div>
            <h4>Bouts:</h4>
            <ul>
              {bouts.map((bout, bIndex) => (
                <li key={bIndex}>
                  Bout #{bout.id}: Winner -{" "}
                  <strong>{getWinnerName(bout)}</strong>
                  {getWinnerName(bout) !== "Draw" && (
                    <>
                      {" "}
                      | Loser -{" "}
                      <span style={{ color: "red" }}>{getLoserName(bout)}</span>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
      <h2>GROUP 2</h2>
      {Object.entries(boutsByBracketId2).map(([bracketId, bouts]) => (
        <div key={bracketId} className="mb-6">
          <h3>Bracket ID: {bracketId}</h3>
          <div>
            <h4>Bouts:</h4>
            <ul>
              {bouts.map((bout, bIndex) => (
                <li key={bIndex}>
                  Bout #{bout.id}: Winner -{" "}
                  <strong>{getWinnerName(bout)}</strong>
                  {getWinnerName(bout) !== "Draw" && (
                    <>
                      {" "}
                      | Loser -{" "}
                      <span style={{ color: "red" }}>{getLoserName(bout)}</span>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}

export default EventResults;
