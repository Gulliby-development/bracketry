import { Failure, type Result, type Team, type Tournament } from "./types";

export function parseTournament(display: string, text: string): Tournament {
  const source = text.startsWith("\uFEFF") ? text.slice(1) : text;
  const lines = source.split("\n");
  const teams: Team[] = [];
  const explicitSeeds: Array<number | null> = [];
  const results: Result[] = [];
  const names = new Set<string>();

  for (let index = 0; index < lines.length; index += 1) {
    let line = lines[index];
    if (line === undefined) {
      continue;
    }
    if (index < lines.length - 1 && line.endsWith("\r")) {
      line = line.slice(0, -1);
    }

    const fields = line.split(/[ \t]+/).filter((field) => field !== "");
    const directive = fields[0];
    if (directive === undefined || directive.startsWith("#")) {
      continue;
    }

    const lineNumber = index + 1;
    if (directive !== "team" && directive !== "result") {
      throw new Failure(`${display}:${lineNumber}: unknown directive "${directive}"`);
    }

    if (directive === "team") {
      if (fields.length < 2) {
        throw new Failure(`${display}:${lineNumber}: team needs a name`);
      }
      if (fields.length > 3) {
        throw new Failure(`${display}:${lineNumber}: too many fields`);
      }

      const name = fields[1];
      if (name === undefined || !/^[A-Za-z0-9_-]{1,16}$/.test(name)) {
        throw new Failure(`${display}:${lineNumber}: invalid name "${name ?? ""}"`);
      }

      const seedField = fields[2];
      let seed: number | null = null;
      if (seedField !== undefined) {
        if (!/^(?:[1-9]|[1-5][0-9]|6[0-4])$/.test(seedField)) {
          throw new Failure(`${display}:${lineNumber}: invalid seed "${seedField}"`);
        }
        seed = Number(seedField);
      }

      if (names.has(name)) {
        throw new Failure(`${display}:${lineNumber}: duplicate team "${name}"`);
      }
      names.add(name);
      teams.push({ name, seed: seed ?? 0, line: lineNumber });
      explicitSeeds.push(seed);
      continue;
    }

    if (fields.length < 5) {
      throw new Failure(`${display}:${lineNumber}: result needs two teams and two scores`);
    }
    if (fields.length > 5) {
      throw new Failure(`${display}:${lineNumber}: too many fields`);
    }

    const scoreA = fields[3];
    const scoreB = fields[4];
    const scorePattern = /^(?:0|[1-9][0-9]{0,2})$/;
    if (scoreA === undefined || !scorePattern.test(scoreA)) {
      throw new Failure(`${display}:${lineNumber}: invalid score "${scoreA ?? ""}"`);
    }
    if (scoreB === undefined || !scorePattern.test(scoreB)) {
      throw new Failure(`${display}:${lineNumber}: invalid score "${scoreB ?? ""}"`);
    }

    const a = fields[1];
    const b = fields[2];
    if (a === undefined || b === undefined) {
      continue;
    }
    results.push({
      a,
      b,
      sa: Number(scoreA),
      sb: Number(scoreB),
      line: lineNumber,
    });
  }

  if (teams.length === 0) {
    throw new Failure(`${display}: no teams`);
  }
  if (teams.length === 1) {
    throw new Failure(`${display}: at least 2 teams are needed`);
  }
  if (teams.length > 64) {
    throw new Failure(`${display}: more than 64 teams`);
  }

  const seededCount = explicitSeeds.filter((seed) => seed !== null).length;
  if (seededCount !== 0 && seededCount !== teams.length) {
    throw new Failure(`${display}: seeds must be given for all teams or for none`);
  }

  const usedSeeds = new Set<number>();
  for (let index = 0; index < teams.length; index += 1) {
    const team = teams[index];
    const seed = explicitSeeds[index];
    if (team === undefined) {
      continue;
    }

    if (seed === null || seed === undefined) {
      team.seed = index + 1;
      continue;
    }
    if (seed > teams.length) {
      throw new Failure(
        `${display}:${team.line}: seed ${seed} is more than the number of teams (${teams.length})`,
      );
    }
    if (usedSeeds.has(seed)) {
      throw new Failure(`${display}:${team.line}: duplicate seed ${seed}`);
    }
    usedSeeds.add(seed);
    team.seed = seed;
  }

  return { teams, results };
}
