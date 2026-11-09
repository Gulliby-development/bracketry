import { readFile } from "node:fs/promises";
import { bracketHtml } from "./html";
import { playBracket } from "./bracket";
import { parseTournament } from "./parse";
import { bracketText, nextText, seedText } from "./render";
import { Failure, type Outcome } from "./types";

export const USAGE =
  "usage: bracketry seed FILE\n       bracketry bracket [--round N] FILE\n       bracketry next FILE\n       bracketry html FILE\n";

const COMMANDS = new Set(["seed", "bracket", "next", "html"]);

function error(message: string): Outcome {
  return { code: 2, out: "", err: `bracketry: ${message}\n` };
}

function decode(bytes: Uint8Array): string {
  return new TextDecoder("utf-8", { fatal: true, ignoreBOM: true }).decode(bytes);
}

export async function main(args: string[], stdin: Uint8Array): Promise<Outcome> {
  if (args.length === 1 && args[0] === "--help") {
    return { code: 0, out: USAGE, err: "" };
  }

  const command = args[0];
  if (command === undefined) {
    return error("missing command (seed, bracket, next or html)");
  }
  if (!COMMANDS.has(command)) return error(`unknown command "${command}"`);

  let file: string | undefined;
  let selectedRound: number | undefined;
  for (let index = 1; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === undefined) continue;

    if (argument === "--round" || argument.startsWith("--round=")) {
      if (command !== "bracket") return error('unknown option "--round"');
      let value: string;
      if (argument === "--round") {
        const next = args[index + 1];
        if (next === undefined) return error("--round needs a value");
        value = next;
        index += 1;
      } else {
        value = argument.slice("--round=".length);
      }
      if (!/^[1-6]$/.test(value)) {
        return error(`invalid --round "${value}" (expected a whole number from 1 to 6)`);
      }
      selectedRound = Number(value);
      continue;
    }

    if (argument.startsWith("-") && argument !== "-") {
      return error(`unknown option "${argument}"`);
    }
    if (file !== undefined) return error("too many arguments");
    file = argument;
  }
  if (file === undefined) return error("missing FILE");

  const display = file === "-" ? "<stdin>" : file.replace(/\\/g, "/");
  let bytes: Uint8Array;
  if (file === "-") {
    bytes = stdin;
  } else {
    try {
      bytes = await readFile(file);
    } catch {
      return error(`${display}: cannot read the file`);
    }
  }

  let text: string;
  try {
    text = decode(bytes);
  } catch {
    return error(`${display}: input is not valid UTF-8`);
  }

  try {
    const tournament = parseTournament(display, text);
    const bracket = playBracket(display, tournament);
    if (command === "bracket" && selectedRound !== undefined) {
      if (selectedRound > bracket.rounds.length) {
        const rounds = bracket.rounds.length;
        return error(
          `${display}: the bracket has only ${rounds} ${rounds === 1 ? "round" : "rounds"}`,
        );
      }
      return { code: 0, out: bracketText(bracket, selectedRound), err: "" };
    }
    if (command === "seed") {
      return { code: 0, out: seedText(bracket, tournament.teams.length), err: "" };
    }
    if (command === "bracket") {
      return { code: 0, out: bracketText(bracket), err: "" };
    }
    if (command === "next") {
      return { code: 0, out: nextText(bracket), err: "" };
    }
    return { code: 0, out: bracketHtml(bracket, tournament.teams.length), err: "" };
  } catch (cause) {
    if (cause instanceof Failure) return error(cause.message);
    throw cause;
  }
}
