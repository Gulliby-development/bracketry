import { render } from "svelte/server";
import { countsText, roundViews } from "./render";
import type { Bracket } from "./types";
import BracketView from "./ui/Bracket.svelte";

/** The bracket as HTML, rendered by Svelte's server renderer, with every comment (Svelte's markers) and the whitespace between tags removed. */
export function bracketHtml(b: Bracket, teams: number): string {
  const { body } = render(BracketView, {
    props: { rounds: roundViews(b), summary: countsText(b, teams) },
  });
  return body.replace(/<!--[\s\S]*?-->/g, "").replace(/>\s+</g, "><") + "\n";
}
