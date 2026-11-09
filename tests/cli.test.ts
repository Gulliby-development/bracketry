import { expect, test } from "vitest";
import { check } from "./helpers/run";

// prettier-ignore
const rows = [
  { args: [], stdin: "", code: 2, out: "", err: "bracketry: missing command (seed, bracket, next or html)\n" },
  { args: ["bogus"], stdin: "", code: 2, out: "", err: "bracketry: unknown command \"bogus\"\n" },
  { args: ["seed"], stdin: "", code: 2, out: "", err: "bracketry: missing FILE\n" },
  { args: ["seed", "-", "-"], stdin: "team Ann\nteam Bob\nteam Cy\nteam Dee\n", code: 2, out: "", err: "bracketry: too many arguments\n" },
  { args: ["seed", "-x", "-"], stdin: "team Ann\nteam Bob\nteam Cy\nteam Dee\n", code: 2, out: "", err: "bracketry: unknown option \"-x\"\n" },
  { args: ["next", "--round=1", "-"], stdin: "team Ann\nteam Bob\nteam Cy\nteam Dee\n", code: 2, out: "", err: "bracketry: unknown option \"--round\"\n" },
  { args: ["--help"], stdin: "", code: 0, out: "usage: bracketry seed FILE\n       bracketry bracket [--round N] FILE\n       bracketry next FILE\n       bracketry html FILE\n", err: "" },
  { args: ["--help", "seed"], stdin: "", code: 2, out: "", err: "bracketry: unknown command \"--help\"\n" },
  { args: ["seed", "/no/such/bracketry-file.txt"], stdin: "", code: 2, out: "", err: "bracketry: /no/such/bracketry-file.txt: cannot read the file\n" },
  { args: ["bracket", "--round"], stdin: "", code: 2, out: "", err: "bracketry: --round needs a value\n" },
  { args: ["bracket", "--round", "0", "-"], stdin: "team Ann\nteam Bob\nteam Cy\nteam Dee\n", code: 2, out: "", err: "bracketry: invalid --round \"0\" (expected a whole number from 1 to 6)\n" },
  { args: ["bracket", "--round", "7", "-"], stdin: "team Ann\nteam Bob\nteam Cy\nteam Dee\n", code: 2, out: "", err: "bracketry: invalid --round \"7\" (expected a whole number from 1 to 6)\n" },
  { args: ["bracket", "--round=x", "-"], stdin: "team Ann\nteam Bob\nteam Cy\nteam Dee\n", code: 2, out: "", err: "bracketry: invalid --round \"x\" (expected a whole number from 1 to 6)\n" },
  { args: ["bracket", "--round", "3", "-"], stdin: "team Ann\nteam Bob\nteam Cy\nteam Dee\n", code: 2, out: "", err: "bracketry: <stdin>: the bracket has only 2 rounds\n" },
  { args: ["bracket", "--round", "2", "-"], stdin: "team Ann\nteam Bob\n", code: 2, out: "", err: "bracketry: <stdin>: the bracket has only 1 round\n" },
  { args: ["bracket", "--round=1", "--round", "9", "-"], stdin: "team Ann\nteam Bob\nteam Cy\nteam Dee\n", code: 2, out: "", err: "bracketry: invalid --round \"9\" (expected a whole number from 1 to 6)\n" },
];

for (const [index, row] of rows.entries()) {
  test(`row ${index + 1}`, async () => {
    expect(await check(row)).toEqual(row);
  });
}
