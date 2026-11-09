import { Failure } from "./types";
import type { Bracket, Match, Side, Tournament } from "./types";

const OPEN: Side = { kind: "open" };
const BYE: Side = { kind: "bye" };

export function slotOrder(size: number): number[] {
  if (size <= 1) return [1];

  const previous = slotOrder(size / 2);
  const order: number[] = [];
  for (const seed of previous) {
    order.push(seed, size + 1 - seed);
  }
  return order;
}

function teamSide(seed: number, name: string): Side {
  return { kind: "team", seed, name };
}

function sameTeam(side: Side, name: string): boolean {
  return side.kind === "team" && side.name === name;
}

function stateFor(left: Side, right: Side, winner: string | null): Match["state"] {
  if (winner !== null) return "played";
  if (right.kind === "bye") return "bye";
  if (left.kind === "team" && right.kind === "team") return "open";
  return "waiting";
}

function makeMatch(round: number, index: number, left: Side, right: Side): Match {
  return {
    round,
    index,
    left,
    right,
    score: null,
    winner: null,
    state: stateFor(left, right, null),
  };
}

export function playBracket(display: string, tournament: Tournament): Bracket {
  const teamsBySeed = new Map(tournament.teams.map((team) => [team.seed, team]));
  const teamsByName = new Map(tournament.teams.map((team) => [team.name, team]));
  let size = 2;
  while (size < tournament.teams.length) size *= 2;

  const order = slotOrder(size);
  const roundCount = Math.log2(size);
  const rounds: Match[][] = [];
  const firstRound: Match[] = [];

  for (let index = 0; index < order.length; index += 2) {
    const leftSeed = order[index];
    const rightSeed = order[index + 1];
    if (leftSeed === undefined || rightSeed === undefined) continue;

    const leftTeam = teamsBySeed.get(leftSeed);
    const rightTeam = teamsBySeed.get(rightSeed);
    const left: Side = leftTeam ? teamSide(leftTeam.seed, leftTeam.name) : BYE;
    const right: Side = rightTeam ? teamSide(rightTeam.seed, rightTeam.name) : BYE;
    const match = makeMatch(1, index / 2 + 1, left, right);

    if (left.kind === "team" && right.kind === "bye") {
      match.winner = left.name;
      match.state = "bye";
    } else if (left.kind === "bye" && right.kind === "team") {
      match.winner = right.name;
      match.state = "bye";
    }
    firstRound.push(match);
  }
  rounds.push(firstRound);

  for (let round = 2; round <= roundCount; round += 1) {
    const previousRound = rounds[round - 2];
    if (!previousRound) continue;
    const matches: Match[] = [];
    for (let index = 0; index < previousRound.length / 2; index += 1) {
      matches.push(makeMatch(round, index + 1, OPEN, OPEN));
    }
    rounds.push(matches);
  }

  const bracket: Bracket = {
    size,
    byes: size - tournament.teams.length,
    rounds,
    champion: null,
  };

  function advance(match: Match): void {
    if (match.winner === null || match.round >= rounds.length) return;
    const nextRound = rounds[match.round];
    const destination = nextRound?.[Math.floor((match.index - 1) / 2)];
    if (!destination) return;

    const winner = teamsByName.get(match.winner);
    if (!winner) return;
    const side = teamSide(winner.seed, winner.name);
    if (match.index % 2 === 1) destination.left = side;
    else destination.right = side;
    destination.state = stateFor(destination.left, destination.right, destination.winner);
  }

  for (const match of firstRound) advance(match);

  for (const result of tournament.results) {
    if (!teamsByName.has(result.a)) {
      throw new Failure(`${display}:${result.line}: unknown team "${result.a}"`);
    }
    if (!teamsByName.has(result.b)) {
      throw new Failure(`${display}:${result.line}: unknown team "${result.b}"`);
    }
    if (result.a === result.b) {
      throw new Failure(`${display}:${result.line}: a team cannot play itself`);
    }
    if (result.sa === result.sb) {
      throw new Failure(`${display}:${result.line}: the score ${result.sa}-${result.sb} is a tie`);
    }

    let found: Match | undefined;
    for (const round of rounds) {
      found = round.find(
        (match) =>
          (sameTeam(match.left, result.a) && sameTeam(match.right, result.b)) ||
          (sameTeam(match.left, result.b) && sameTeam(match.right, result.a)),
      );
      if (found) break;
    }
    if (!found) {
      throw new Failure(
        `${display}:${result.line}: ${result.a} and ${result.b} do not meet in any match`,
      );
    }
    if (found.winner !== null) {
      throw new Failure(
        `${display}:${result.line}: ${result.a} and ${result.b} have already played`,
      );
    }

    const leftScore = sameTeam(found.left, result.a) ? result.sa : result.sb;
    const rightScore = sameTeam(found.right, result.b) ? result.sb : result.sa;
    found.score = [leftScore, rightScore];
    found.winner =
      leftScore > rightScore
        ? found.left.kind === "team"
          ? found.left.name
          : null
        : found.right.kind === "team"
          ? found.right.name
          : null;
    found.state = "played";
    advance(found);
  }

  const finalRound = rounds[rounds.length - 1];
  const final = finalRound?.[0];
  bracket.champion = final?.winner ?? null;
  return bracket;
}
