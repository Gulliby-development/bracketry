import { expect, test } from "vitest";
import { check } from "./helpers/run";

// prettier-ignore
const rows = [
  { args: ["next", "-"], stdin: "team Ann\nteam Bob\n", code: 0, out: "R1 M1: 1 Ann vs 2 Bob\n", err: "" },
  { args: ["next", "-"], stdin: "team Ann\nteam Bob\nteam Cy\n", code: 0, out: "R1 M2: 2 Bob vs 3 Cy\n", err: "" },
  { args: ["next", "-"], stdin: "team Ann\nteam Bob\nteam Cy\nteam Dee\n", code: 0, out: "R1 M1: 1 Ann vs 4 Dee\nR1 M2: 2 Bob vs 3 Cy\n", err: "" },
  { args: ["next", "-"], stdin: "team Ann\nteam Bob\nteam Cy\nteam Dee\nresult Ann Dee 3 1\n", code: 0, out: "R1 M2: 2 Bob vs 3 Cy\n", err: "" },
  { args: ["next", "-"], stdin: "team Ann\nteam Bob\nteam Cy\nteam Dee\nresult Ann Dee 3 1\nresult Bob Cy 1 2\n", code: 0, out: "R2 M1: 1 Ann vs 3 Cy\n", err: "" },
  { args: ["next", "-"], stdin: "team Ann\nteam Bob\nteam Cy\nteam Dee\nresult Ann Dee 3 1\nresult Bob Cy 1 2\nresult Cy Ann 0 1\n", code: 0, out: "champion: Ann\n", err: "" },
  { args: ["next", "-"], stdin: "team Ann\nteam Bob\nteam Cy\nteam Dee\nteam Eve\nteam Fay\nresult Dee Eve 1 0\nresult Cy Fay 0 1\n", code: 0, out: "R2 M1: 1 Ann vs 4 Dee\nR2 M2: 2 Bob vs 6 Fay\n", err: "" },
];

for (const [index, row] of rows.entries()) {
  test(`row ${index + 1}`, async () => {
    expect(await check(row)).toEqual(row);
  });
}
