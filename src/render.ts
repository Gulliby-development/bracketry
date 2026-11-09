import type { Bracket, Match, RoundView, Side } from "./types";

export function sideLabel(side: Side): string {
  if (side.kind === "open") return "?";
  if (side.kind === "bye") return "bye";
  return `${side.seed} ${side.name}`;
}

export function countsText(bracket: Bracket, teams: number): string {
  const byes = bracket.byes;
  return `${teams} teams, bracket of ${bracket.size}, ${byes} ${byes === 1 ? "bye" : "byes"}`;
}

export function roundTitle(round: number, totalRounds: number): string {
  const distanceFromFinal = totalRounds - round;
  if (distanceFromFinal === 0) return "Final";
  if (distanceFromFinal === 1) return "Semifinals";
  if (distanceFromFinal === 2) return "Quarterfinals";
  return `Round ${round}`;
}

export function matchText(match: Match): string {
  const left = sideLabel(match.left);
  if (match.state === "bye") return `${left} bye`;
  const right = sideLabel(match.right);
  if (match.state === "played" && match.score !== null && match.winner !== null) {
    return `${left} vs ${right}, ${match.score[0]}-${match.score[1]}, winner ${match.winner}`;
  }
  return `${left} vs ${right}`;
}

export function seedText(bracket: Bracket, teams: number): string {
  const firstRound = bracket.rounds[0] ?? [];
  const matches = firstRound.map((match) => `M${match.index}: ${matchText(match)}`);
  return [...matches, countsText(bracket, teams)].join("\n") + "\n";
}

function roundBlock(bracket: Bracket, roundIndex: number): string {
  const matches = bracket.rounds[roundIndex] ?? [];
  const title = roundTitle(roundIndex + 1, bracket.rounds.length);
  return [title, ...matches.map((match) => `  M${match.index}: ${matchText(match)}`)].join("\n");
}

export function bracketText(bracket: Bracket, selectedRound?: number): string {
  if (selectedRound !== undefined) return `${roundBlock(bracket, selectedRound - 1)}\n`;
  const blocks = bracket.rounds.map((_round, index) => roundBlock(bracket, index));
  const champion =
    bracket.champion === null ? "champion: not decided" : `champion: ${bracket.champion}`;
  return `${blocks.join("\n\n")}\n\n${champion}\n`;
}

export function nextText(bracket: Bracket): string {
  const openMatches = bracket.rounds.flatMap((round) =>
    round
      .filter((match) => match.state === "open")
      .map((match) => `R${match.round} M${match.index}: ${matchText(match)}`),
  );
  if (openMatches.length === 0) {
    const champion = bracket.champion === null ? "not decided" : bracket.champion;
    return `champion: ${champion}\n`;
  }
  return `${openMatches.join("\n")}\n`;
}

export function roundViews(bracket: Bracket): RoundView[] {
  return bracket.rounds.map((matches, index) => ({
    number: index + 1,
    title: roundTitle(index + 1, bracket.rounds.length),
    matches: matches.map((match) => ({
      id: `M${match.index}`,
      state: match.state,
      left: sideLabel(match.left),
      right: match.state === "bye" ? "" : sideLabel(match.right),
      note:
        match.state === "played" && match.score !== null && match.winner !== null
          ? `${match.score[0]}-${match.score[1]} ${match.winner}`
          : "",
    })),
  }));
}
