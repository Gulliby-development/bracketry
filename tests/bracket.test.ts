import { expect, test } from "vitest";
import { check } from "./helpers/run";

// prettier-ignore
const rows = [
  { args: ["bracket", "-"], stdin: "team Ann\nteam Bob\n", code: 0, out: "Final\n  M1: 1 Ann vs 2 Bob\n\nchampion: not decided\n", err: "" },
  { args: ["bracket", "-"], stdin: "team Ann\nteam Bob\nteam Cy\n", code: 0, out: "Semifinals\n  M1: 1 Ann bye\n  M2: 2 Bob vs 3 Cy\n\nFinal\n  M1: 1 Ann vs ?\n\nchampion: not decided\n", err: "" },
  { args: ["bracket", "-"], stdin: "team Ann\nteam Bob\nteam Cy\nteam Dee\n", code: 0, out: "Semifinals\n  M1: 1 Ann vs 4 Dee\n  M2: 2 Bob vs 3 Cy\n\nFinal\n  M1: ? vs ?\n\nchampion: not decided\n", err: "" },
  { args: ["bracket", "-"], stdin: "team Ann\nteam Bob\nteam Cy\nteam Dee\nteam Eve\n", code: 0, out: "Quarterfinals\n  M1: 1 Ann bye\n  M2: 4 Dee vs 5 Eve\n  M3: 2 Bob bye\n  M4: 3 Cy bye\n\nSemifinals\n  M1: 1 Ann vs ?\n  M2: 2 Bob vs 3 Cy\n\nFinal\n  M1: ? vs ?\n\nchampion: not decided\n", err: "" },
  { args: ["bracket", "-"], stdin: "team Ann\nteam Bob\nteam Cy\nteam Dee\nteam Eve\nteam Fay\n", code: 0, out: "Quarterfinals\n  M1: 1 Ann bye\n  M2: 4 Dee vs 5 Eve\n  M3: 2 Bob bye\n  M4: 3 Cy vs 6 Fay\n\nSemifinals\n  M1: 1 Ann vs ?\n  M2: 2 Bob vs ?\n\nFinal\n  M1: ? vs ?\n\nchampion: not decided\n", err: "" },
  { args: ["bracket", "-"], stdin: "team Ann\nteam Bob\nteam Cy\nteam Dee\nresult Ann Dee 3 1\n", code: 0, out: "Semifinals\n  M1: 1 Ann vs 4 Dee, 3-1, winner Ann\n  M2: 2 Bob vs 3 Cy\n\nFinal\n  M1: 1 Ann vs ?\n\nchampion: not decided\n", err: "" },
  { args: ["bracket", "-"], stdin: "team Ann\nteam Bob\nteam Cy\nteam Dee\nresult Bob Cy 0 2\nresult Dee Ann 1 4\n", code: 0, out: "Semifinals\n  M1: 1 Ann vs 4 Dee, 4-1, winner Ann\n  M2: 2 Bob vs 3 Cy, 0-2, winner Cy\n\nFinal\n  M1: 1 Ann vs 3 Cy\n\nchampion: not decided\n", err: "" },
  { args: ["bracket", "-"], stdin: "team Ann\nteam Bob\nteam Cy\nteam Dee\nresult Ann Dee 3 1\nresult Cy Bob 1 0\nresult Cy Ann 2 7\n", code: 0, out: "Semifinals\n  M1: 1 Ann vs 4 Dee, 3-1, winner Ann\n  M2: 2 Bob vs 3 Cy, 0-1, winner Cy\n\nFinal\n  M1: 1 Ann vs 3 Cy, 7-2, winner Ann\n\nchampion: Ann\n", err: "" },
  { args: ["bracket", "-"], stdin: "team Ann\nteam Bob\nteam Cy\nteam Dee\nteam Eve\nteam Fay\nteam Gus\nteam Hal\nresult Ann Hal 3 0\nresult Dee Eve 1 2\nresult Bob Gus 5 4\nresult Cy Fay 0 1\nresult Ann Eve 2 1\n", code: 0, out: "Quarterfinals\n  M1: 1 Ann vs 8 Hal, 3-0, winner Ann\n  M2: 4 Dee vs 5 Eve, 1-2, winner Eve\n  M3: 2 Bob vs 7 Gus, 5-4, winner Bob\n  M4: 3 Cy vs 6 Fay, 0-1, winner Fay\n\nSemifinals\n  M1: 1 Ann vs 5 Eve, 2-1, winner Ann\n  M2: 2 Bob vs 6 Fay\n\nFinal\n  M1: 1 Ann vs ?\n\nchampion: not decided\n", err: "" },
  { args: ["bracket", "--round", "1", "-"], stdin: "team Ann\nteam Bob\nteam Cy\nteam Dee\nteam Eve\nteam Fay\n", code: 0, out: "Quarterfinals\n  M1: 1 Ann bye\n  M2: 4 Dee vs 5 Eve\n  M3: 2 Bob bye\n  M4: 3 Cy vs 6 Fay\n", err: "" },
  { args: ["bracket", "--round=2", "-"], stdin: "team Ann\nteam Bob\nteam Cy\nteam Dee\nteam Eve\nteam Fay\nresult Dee Eve 1 0\n", code: 0, out: "Semifinals\n  M1: 1 Ann vs 4 Dee\n  M2: 2 Bob vs ?\n", err: "" },
  { args: ["bracket", "--round", "3", "-"], stdin: "team Ann\nteam Bob\nteam Cy\nteam Dee\nteam Eve\nteam Fay\n", code: 0, out: "Final\n  M1: ? vs ?\n", err: "" },
  { args: ["bracket", "-"], stdin: "team Ann 4\nteam Bob 3\nteam Cy 2\nteam Dee 1\nresult Dee Ann 1 0\nresult Cy Bob 1 0\nresult Cy Dee 9 8\n", code: 0, out: "Semifinals\n  M1: 1 Dee vs 4 Ann, 1-0, winner Dee\n  M2: 2 Cy vs 3 Bob, 1-0, winner Cy\n\nFinal\n  M1: 1 Dee vs 2 Cy, 8-9, winner Cy\n\nchampion: Cy\n", err: "" },
];

for (const [index, row] of rows.entries()) {
  test(`row ${index + 1}`, async () => {
    expect(await check(row)).toEqual(row);
  });
}
