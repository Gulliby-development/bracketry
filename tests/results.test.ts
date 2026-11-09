import { expect, test } from "vitest";
import { check } from "./helpers/run";

// prettier-ignore
const rows = [
  { args: ["bracket", "-"], stdin: "team Ann\nteam Bob\nteam Cy\nteam Dee\nresult Ann Zed 1 0\n", code: 2, out: "", err: "bracketry: <stdin>:5: unknown team \"Zed\"\n" },
  { args: ["bracket", "-"], stdin: "team Ann\nteam Bob\nteam Cy\nteam Dee\nresult Zed Ann 1 0\n", code: 2, out: "", err: "bracketry: <stdin>:5: unknown team \"Zed\"\n" },
  { args: ["bracket", "-"], stdin: "team Ann\nteam Bob\nteam Cy\nteam Dee\nresult Ann Ann 1 0\n", code: 2, out: "", err: "bracketry: <stdin>:5: a team cannot play itself\n" },
  { args: ["bracket", "-"], stdin: "team Ann\nteam Bob\nteam Cy\nteam Dee\nresult Ann Dee 2 2\n", code: 2, out: "", err: "bracketry: <stdin>:5: the score 2-2 is a tie\n" },
  { args: ["bracket", "-"], stdin: "team Ann\nteam Bob\nteam Cy\nteam Dee\nresult Ann Bob 1 0\n", code: 2, out: "", err: "bracketry: <stdin>:5: Ann and Bob do not meet in any match\n" },
  { args: ["bracket", "-"], stdin: "team Ann\nteam Bob\nteam Cy\nteam Dee\nresult Ann Cy 1 0\n", code: 2, out: "", err: "bracketry: <stdin>:5: Ann and Cy do not meet in any match\n" },
  { args: ["bracket", "-"], stdin: "team Ann\nteam Bob\nteam Cy\nteam Dee\nresult Ann Dee 2 1\nresult Dee Ann 3 1\n", code: 2, out: "", err: "bracketry: <stdin>:6: Dee and Ann have already played\n" },
  { args: ["bracket", "-"], stdin: "team Ann\nteam Bob\nteam Cy\nteam Dee\nresult Ann Dee 2 1\nresult Ann Cy 1 0\n", code: 2, out: "", err: "bracketry: <stdin>:6: Ann and Cy do not meet in any match\n" },
  { args: ["bracket", "-"], stdin: "team Ann\nteam Bob\nteam Cy\nteam Dee\nresult Ann Dee 2 1\nresult Bob Cy 3 2\nresult Ann Cy 9 0\n", code: 2, out: "", err: "bracketry: <stdin>:7: Ann and Cy do not meet in any match\n" },
  { args: ["bracket", "-"], stdin: "team Ann\nteam Bob\nteam Cy\nteam Dee\nteam Eve\nresult Ann Eve 1 0\n", code: 2, out: "", err: "bracketry: <stdin>:6: Ann and Eve do not meet in any match\n" },
  { args: ["bracket", "-"], stdin: "team Ann\nteam Bob\nteam Cy\nteam Dee\nteam Eve\nresult Dee Eve 1 0\nresult Ann Bob 1 0\n", code: 2, out: "", err: "bracketry: <stdin>:7: Ann and Bob do not meet in any match\n" },
  { args: ["bracket", "-"], stdin: "team Ann\nteam Bob\nteam Cy\nresult Ann Cy 1 0\n", code: 2, out: "", err: "bracketry: <stdin>:4: Ann and Cy do not meet in any match\n" },
  { args: ["bracket", "-"], stdin: "team Ann\nteam Bob\nteam Cy\nresult Bob Cy 1 0\nresult Ann Cy 1 0\n", code: 2, out: "", err: "bracketry: <stdin>:5: Ann and Cy do not meet in any match\n" },
  { args: ["bracket", "-"], stdin: "team Ann\nteam Bob\nteam Cy\nresult Bob Cy 1 0\nresult Cy Ann 1 0\nresult Ann Cy 1 0\n", code: 2, out: "", err: "bracketry: <stdin>:5: Cy and Ann do not meet in any match\n" },
  { args: ["bracket", "-"], stdin: "team Ann\nteam Bob\nresult Ann Bob 1 0\nresult Bob Ann 1 0\n", code: 2, out: "", err: "bracketry: <stdin>:4: Bob and Ann have already played\n" },
  { args: ["bracket", "-"], stdin: "team A\nteam B\nteam C\nteam D\nteam E\nteam F\nresult C F 1 0\nresult A E 1 0\n", code: 2, out: "", err: "bracketry: <stdin>:8: A and E do not meet in any match\n" },
  { args: ["bracket", "-"], stdin: "team Ann\nteam Bob\nteam Cy\nteam Dee\nresult Ann Dee 5 4\nresult Dee Cy 1 0\n", code: 2, out: "", err: "bracketry: <stdin>:6: Dee and Cy do not meet in any match\n" },
];

for (const [index, row] of rows.entries()) {
  test(`row ${index + 1}`, async () => {
    expect(await check(row)).toEqual(row);
  });
}
