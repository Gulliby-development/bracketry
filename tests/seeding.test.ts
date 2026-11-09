import { expect, test } from "vitest";
import { check } from "./helpers/run";

// prettier-ignore
const rows = [
  { args: ["seed", "-"], stdin: "team Ann\nteam Bob\n", code: 0, out: "M1: 1 Ann vs 2 Bob\n2 teams, bracket of 2, 0 byes\n", err: "" },
  { args: ["seed", "-"], stdin: "team Ann\nteam Bob\nteam Cy\n", code: 0, out: "M1: 1 Ann bye\nM2: 2 Bob vs 3 Cy\n3 teams, bracket of 4, 1 bye\n", err: "" },
  { args: ["seed", "-"], stdin: "team Ann\nteam Bob\nteam Cy\nteam Dee\n", code: 0, out: "M1: 1 Ann vs 4 Dee\nM2: 2 Bob vs 3 Cy\n4 teams, bracket of 4, 0 byes\n", err: "" },
  { args: ["seed", "-"], stdin: "team Ann\nteam Bob\nteam Cy\nteam Dee\nteam Eve\n", code: 0, out: "M1: 1 Ann bye\nM2: 4 Dee vs 5 Eve\nM3: 2 Bob bye\nM4: 3 Cy bye\n5 teams, bracket of 8, 3 byes\n", err: "" },
  { args: ["seed", "-"], stdin: "team Ann\nteam Bob\nteam Cy\nteam Dee\nteam Eve\nteam Fay\n", code: 0, out: "M1: 1 Ann bye\nM2: 4 Dee vs 5 Eve\nM3: 2 Bob bye\nM4: 3 Cy vs 6 Fay\n6 teams, bracket of 8, 2 byes\n", err: "" },
  { args: ["seed", "-"], stdin: "team A\nteam B\nteam C\nteam D\nteam E\nteam F\nteam G\n", code: 0, out: "M1: 1 A bye\nM2: 4 D vs 5 E\nM3: 2 B vs 7 G\nM4: 3 C vs 6 F\n7 teams, bracket of 8, 1 bye\n", err: "" },
  { args: ["seed", "-"], stdin: "team Ann\nteam Bob\nteam Cy\nteam Dee\nteam Eve\nteam Fay\nteam Gus\nteam Hal\n", code: 0, out: "M1: 1 Ann vs 8 Hal\nM2: 4 Dee vs 5 Eve\nM3: 2 Bob vs 7 Gus\nM4: 3 Cy vs 6 Fay\n8 teams, bracket of 8, 0 byes\n", err: "" },
  { args: ["seed", "-"], stdin: "team A\nteam B\nteam C\nteam D\nteam E\nteam F\nteam G\nteam H\nteam I\n", code: 0, out: "M1: 1 A bye\nM2: 8 H vs 9 I\nM3: 4 D bye\nM4: 5 E bye\nM5: 2 B bye\nM6: 7 G bye\nM7: 3 C bye\nM8: 6 F bye\n9 teams, bracket of 16, 7 byes\n", err: "" },
  { args: ["seed", "-"], stdin: "team T1\nteam T2\nteam T3\nteam T4\nteam T5\nteam T6\nteam T7\nteam T8\nteam T9\nteam T10\nteam T11\nteam T12\n", code: 0, out: "M1: 1 T1 bye\nM2: 8 T8 vs 9 T9\nM3: 4 T4 bye\nM4: 5 T5 vs 12 T12\nM5: 2 T2 bye\nM6: 7 T7 vs 10 T10\nM7: 3 T3 bye\nM8: 6 T6 vs 11 T11\n12 teams, bracket of 16, 4 byes\n", err: "" },
  { args: ["seed", "-"], stdin: "team Ann 3\nteam Bob 1\nteam Cy 2\nteam Dee 4\n", code: 0, out: "M1: 1 Bob vs 4 Dee\nM2: 2 Cy vs 3 Ann\n4 teams, bracket of 4, 0 byes\n", err: "" },
  { args: ["seed", "-"], stdin: "team Ann 2\nteam Bob 1\nteam Cy 3\n", code: 0, out: "M1: 1 Bob bye\nM2: 2 Ann vs 3 Cy\n3 teams, bracket of 4, 1 bye\n", err: "" },
  { args: ["seed", "-"], stdin: "team Ann 5\nteam Bob 1\nteam Cy 2\n", code: 2, out: "", err: "bracketry: <stdin>:1: seed 5 is more than the number of teams (3)\n" },
  { args: ["seed", "-"], stdin: "team Ann 1\nteam Bob 1\n", code: 2, out: "", err: "bracketry: <stdin>:2: duplicate seed 1\n" },
  { args: ["seed", "-"], stdin: "team Ann\nteam Bob 2\n", code: 2, out: "", err: "bracketry: <stdin>: seeds must be given for all teams or for none\n" },
  { args: ["seed", "-"], stdin: "team Ann 1\nteam Bob 2\nteam Cy 2\nteam Dee 9\n", code: 2, out: "", err: "bracketry: <stdin>:3: duplicate seed 2\n" },
  { args: ["seed", "-"], stdin: "team T1\nteam T2\nteam T3\nteam T4\nteam T5\nteam T6\nteam T7\nteam T8\nteam T9\nteam T10\nteam T11\nteam T12\nteam T13\nteam T14\nteam T15\nteam T16\nteam T17\nteam T18\nteam T19\nteam T20\nteam T21\nteam T22\nteam T23\nteam T24\nteam T25\nteam T26\nteam T27\nteam T28\nteam T29\nteam T30\nteam T31\nteam T32\nteam T33\nteam T34\nteam T35\nteam T36\nteam T37\nteam T38\nteam T39\nteam T40\nteam T41\nteam T42\nteam T43\nteam T44\nteam T45\nteam T46\nteam T47\nteam T48\nteam T49\nteam T50\nteam T51\nteam T52\nteam T53\nteam T54\nteam T55\nteam T56\nteam T57\nteam T58\nteam T59\nteam T60\nteam T61\nteam T62\nteam T63\nteam T64\n", code: 0, out: "M1: 1 T1 vs 64 T64\nM2: 32 T32 vs 33 T33\nM3: 16 T16 vs 49 T49\nM4: 17 T17 vs 48 T48\nM5: 8 T8 vs 57 T57\nM6: 25 T25 vs 40 T40\nM7: 9 T9 vs 56 T56\nM8: 24 T24 vs 41 T41\nM9: 4 T4 vs 61 T61\nM10: 29 T29 vs 36 T36\nM11: 13 T13 vs 52 T52\nM12: 20 T20 vs 45 T45\nM13: 5 T5 vs 60 T60\nM14: 28 T28 vs 37 T37\nM15: 12 T12 vs 53 T53\nM16: 21 T21 vs 44 T44\nM17: 2 T2 vs 63 T63\nM18: 31 T31 vs 34 T34\nM19: 15 T15 vs 50 T50\nM20: 18 T18 vs 47 T47\nM21: 7 T7 vs 58 T58\nM22: 26 T26 vs 39 T39\nM23: 10 T10 vs 55 T55\nM24: 23 T23 vs 42 T42\nM25: 3 T3 vs 62 T62\nM26: 30 T30 vs 35 T35\nM27: 14 T14 vs 51 T51\nM28: 19 T19 vs 46 T46\nM29: 6 T6 vs 59 T59\nM30: 27 T27 vs 38 T38\nM31: 11 T11 vs 54 T54\nM32: 22 T22 vs 43 T43\n64 teams, bracket of 64, 0 byes\n", err: "" },
  { args: ["seed", "-"], stdin: "team Ann\nteam Bob\nteam Cy\nteam Dee\nresult Ann Bob 3 1\n", code: 2, out: "", err: "bracketry: <stdin>:5: Ann and Bob do not meet in any match\n" },
];

for (const [index, row] of rows.entries()) {
  test(`row ${index + 1}`, async () => {
    expect(await check(row)).toEqual(row);
  });
}
