export interface Team {
  name: string;
  seed: number;
  line: number;
}

export interface Result {
  a: string;
  b: string;
  sa: number;
  sb: number;
  line: number;
}

export interface Tournament {
  teams: Team[];
  results: Result[];
}

export type Side =
  { kind: "team"; seed: number; name: string } | { kind: "open" } | { kind: "bye" };

export interface Match {
  round: number;
  index: number;
  left: Side;
  right: Side;
  score: [number, number] | null;
  winner: string | null;
  state: "bye" | "played" | "open" | "waiting";
}

export interface Bracket {
  size: number;
  byes: number;
  rounds: Match[][];
  champion: string | null;
}

export interface MatchView {
  id: string;
  state: string;
  left: string;
  right: string;
  note: string;
}

export interface RoundView {
  number: number;
  title: string;
  matches: MatchView[];
}

export interface Outcome {
  code: number;
  out: string;
  err: string;
}

export class Failure extends Error {}
