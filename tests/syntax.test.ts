import { expect, test } from "vitest";
import { check } from "./helpers/run";

// prettier-ignore
const rows = [
  { args: ["seed", "-"], stdin: "bogus A\n", code: 2, out: "", err: "bracketry: <stdin>:1: unknown directive \"bogus\"\n" },
  { args: ["seed", "-"], stdin: "team\n", code: 2, out: "", err: "bracketry: <stdin>:1: team needs a name\n" },
  { args: ["seed", "-"], stdin: "team A B C\n", code: 2, out: "", err: "bracketry: <stdin>:1: too many fields\n" },
  { args: ["seed", "-"], stdin: "team a!b\n", code: 2, out: "", err: "bracketry: <stdin>:1: invalid name \"a!b\"\n" },
  { args: ["seed", "-"], stdin: "team abcdefghijklmnopq\n", code: 2, out: "", err: "bracketry: <stdin>:1: invalid name \"abcdefghijklmnopq\"\n" },
  { args: ["seed", "-"], stdin: "team Ann 0\n", code: 2, out: "", err: "bracketry: <stdin>:1: invalid seed \"0\"\n" },
  { args: ["seed", "-"], stdin: "team Ann 65\n", code: 2, out: "", err: "bracketry: <stdin>:1: invalid seed \"65\"\n" },
  { args: ["seed", "-"], stdin: "team Ann 01\n", code: 2, out: "", err: "bracketry: <stdin>:1: invalid seed \"01\"\n" },
  { args: ["seed", "-"], stdin: "team Ann\nteam Ann\n", code: 2, out: "", err: "bracketry: <stdin>:2: duplicate team \"Ann\"\n" },
  { args: ["seed", "-"], stdin: "result A B 1\n", code: 2, out: "", err: "bracketry: <stdin>:1: result needs two teams and two scores\n" },
  { args: ["seed", "-"], stdin: "result A B x 2\n", code: 2, out: "", err: "bracketry: <stdin>:1: invalid score \"x\"\n" },
  { args: ["seed", "-"], stdin: "result A B 1 1000\n", code: 2, out: "", err: "bracketry: <stdin>:1: invalid score \"1000\"\n" },
  { args: ["seed", "-"], stdin: "team Ann\n# c\r\n\r\nresult\r\n", code: 2, out: "", err: "bracketry: <stdin>:4: result needs two teams and two scores\n" },
  { args: ["seed", "-"], stdin: "\ufeffteam A\n", code: 2, out: "", err: "bracketry: <stdin>: at least 2 teams are needed\n" },
  { args: ["seed", "-"], stdin: "# only comments\n\n   \n", code: 2, out: "", err: "bracketry: <stdin>: no teams\n" },
  { args: ["seed", "-"], stdin: "team abcdefghijklmnop\nteam Bob\n", code: 0, out: "M1: 1 abcdefghijklmnop vs 2 Bob\n2 teams, bracket of 2, 0 byes\n", err: "" },
  { args: ["seed", "-"], stdin: "team Ann\nteam Bob\nresult Ann Bob 999 0\nresult Cy Dee 1000 0\n", code: 2, out: "", err: "bracketry: <stdin>:4: invalid score \"1000\"\n" },
  { args: ["seed", "-"], stdin: "  team \t Ann  \n\tteam   Bob\t \n", code: 0, out: "M1: 1 Ann vs 2 Bob\n2 teams, bracket of 2, 0 byes\n", err: "" },
  { args: ["seed", "-"], stdin: "", code: 2, out: "", err: "bracketry: <stdin>: no teams\n" },
  { args: ["seed", "-"], stdin: "team Ann\n", code: 2, out: "", err: "bracketry: <stdin>: at least 2 teams are needed\n" },
  { args: ["seed", "-"], stdin: "team T1\nteam T2\nteam T3\nteam T4\nteam T5\nteam T6\nteam T7\nteam T8\nteam T9\nteam T10\nteam T11\nteam T12\nteam T13\nteam T14\nteam T15\nteam T16\nteam T17\nteam T18\nteam T19\nteam T20\nteam T21\nteam T22\nteam T23\nteam T24\nteam T25\nteam T26\nteam T27\nteam T28\nteam T29\nteam T30\nteam T31\nteam T32\nteam T33\nteam T34\nteam T35\nteam T36\nteam T37\nteam T38\nteam T39\nteam T40\nteam T41\nteam T42\nteam T43\nteam T44\nteam T45\nteam T46\nteam T47\nteam T48\nteam T49\nteam T50\nteam T51\nteam T52\nteam T53\nteam T54\nteam T55\nteam T56\nteam T57\nteam T58\nteam T59\nteam T60\nteam T61\nteam T62\nteam T63\nteam T64\nteam T65\n", code: 2, out: "", err: "bracketry: <stdin>: more than 64 teams\n" },
];

for (const [index, row] of rows.entries()) {
  test(`row ${index + 1}`, async () => {
    expect(await check(row)).toEqual(row);
  });
}
