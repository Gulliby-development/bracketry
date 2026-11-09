<p align="center"><img src="docs/logo.svg" width="96" alt="" /></p>

# bracketry

[![CI](https://github.com/Gulliby-development/bracketry/actions/workflows/ci.yml/badge.svg)](https://github.com/Gulliby-development/bracketry/actions/workflows/ci.yml) [![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

bracketry builds and follows a single-elimination tournament bracket from a
plain-text list of teams and results. It is for club organisers who need a
consistent bracket and for students exploring tournament formats. The bracket
uses standard seeding so high seeds meet as late as possible, awards byes to
top seeds when needed, and reports the matches that can be played next.

The application supports Windows, macOS and Linux. It requires Node.js 20 or
newer and Bun.

## Install and run

From the repository directory, install the project dependencies:

```sh
bun install
```

Run the CLI through Bun:

```sh
bun run --silent bracketry COMMAND [OPTIONS] FILE
```

Use `-` for FILE to read the tournament from standard input; otherwise FILE
is read from disk. For example, these POSIX-shell sessions run in the
repository directory:

```text
$ printf 'team Ann\nteam Bob\nteam Cy\nteam Dee\nteam Eve\n' | bun run --silent bracketry seed -
M1: 1 Ann bye
M2: 4 Dee vs 5 Eve
M3: 2 Bob bye
M4: 3 Cy bye
5 teams, bracket of 8, 3 byes
$ printf 'team Ann\nteam Bob\nteam Cy\nteam Dee\nresult Ann Dee 3 1\nresult Bob Cy 0 2\n' | bun run --silent bracketry next -
R2 M1: 1 Ann vs 3 Cy
$ printf 'team Ann 2\nteam Bob 1\nteam Cy 3\nteam Dee 4\nresult Bob Dee 5 0\nresult Ann Cy 2 1\n' | bun run --silent bracketry bracket --round 2 -
Final
  M1: 1 Bob vs 2 Ann
$ printf 'team Ann\nteam Bob\nresult Ann Cy 1 0\n' | bun run --silent bracketry bracket - 2>&1; echo "exit $?"
bracketry: <stdin>:3: unknown team "Cy"
exit 2
```

## Tournament file

Input is UTF-8 text. A single leading byte-order mark is ignored. Lines are
separated by LF; a CR immediately before an LF is removed. Blank lines and
lines whose first field begins with `#` are ignored. Fields are separated by
one or more spaces or tabs, with surrounding whitespace ignored.

A team declaration has this form:

```text
team NAME [SEED]
```

Names contain 1–16 ASCII letters, digits, underscores or hyphens. Seeds are
optional whole numbers from 1 to 64, written without a sign or leading zero.
Either every team has an explicit seed or none does. Explicit seeds must be
unique and no greater than the number of teams. Without explicit seeds,
teams receive seeds in declaration order. A tournament needs 2–64 teams.

A result declaration has this form:

```text
result TEAM_A TEAM_B SCORE_A SCORE_B
```

Scores are whole numbers from 0 to 999, without a sign or leading zero. Results
are applied in file order. Teams must be distinct and known; their current
match must be available, and a score cannot be tied. A result may be given in
either team order. Displayed scores are always from the match's left side
(seed order) perspective, regardless of the order in the input.

The bracket size is the smallest power of two that can hold all teams, with a
minimum size of two. Seeds are placed in recursive slot order (for example,
four slots are ordered 1, 4, 2, 3). When the team count is not a power of two,
the top seeds advance past first-round byes. Winners advance to the next round.
Matches are `bye`, `played`, `open` when both sides are known and no result
has been recorded, or `waiting` when a side is not known yet. The champion is
the winner of the played final.

## Commands

```text
usage: bracketry seed FILE
       bracketry bracket [--round N] FILE
       bracketry next FILE
       bracketry html FILE
```

With `--help` as the only argument, the program prints the usage text. The
four commands are:

- `seed FILE` prints each first-round match followed by the team, bracket-size
  and bye counts.
- `bracket FILE` prints each round as a titled block, then the champion or
  `champion: not decided`. Round titles include Final, Semifinals and
  Quarterfinals where applicable; earlier rounds are numbered.
- `bracket --round N FILE` prints only the selected round and omits the
  champion line. The option can also be written `--round=N`, may appear
  anywhere among the arguments, and the last supplied value is used. Each
  value is validated when encountered and must be a whole number from 1 to 6.
  Selecting a round beyond the bracket's actual length is an error.
- `next FILE` lists open matches in round and match order. When none are open,
  it reports the champion, or that the champion is not decided.
- `html FILE` renders the bracket as a Svelte server-rendered HTML fragment,
  not as a complete web page. Renderer comments and whitespace between tags
  are removed. The fragment includes round headings and match states, leaves
  out the bye side, includes a score-and-winner note for played matches, and
  ends with the summary and one line feed. It has no stylesheet.

Text output labels matches as `M1`, `M2`, and so on. A known side is shown as
its seed and name; an unknown side is `?`, and a bye is shown as `bye`.
Played matches include the left-oriented score and winner. The `seed` summary
uses singular `bye` for one bye and `byes` otherwise.

## Errors and exit status

Successful commands exit with status 0. Input, argument and tournament errors
exit with status 2, print a diagnostic to standard error, and produce no
standard output. Argument validation occurs before the input file is read.
Diagnostics identify the first error: command and option errors are checked in
argument order; file syntax errors are reported at the first offending line;
team-count and seed-consistency checks follow parsing; results are validated in
file order.

Diagnostics cover missing or unknown commands, unknown options, missing files,
extra arguments and invalid `--round` values; unreadable files and invalid
UTF-8; malformed directives, names, seeds or scores; team-count and seed
problems; unknown teams, self-play, ties, non-matching teams and matches that
already have a result. File paths in diagnostics use forward slashes, and
standard input is identified as `<stdin>`. The diagnostic format is
`bracketry: FILE:LINE: message` for line-specific errors, and
`bracketry: FILE: message` for file-level errors.

## Implementation and development

The CLI entry point `main(args, stdin)` handles argument precedence, file or
standard-input reads, UTF-8 decoding, diagnostics and command dispatch.
`parseTournament(display, text)` parses declarations and assigns seeds.
`slotOrder(size)` creates recursive seed positions, and
`playBracket(display, tournament)` constructs the bracket, applies ordered
results and determines advancement and the champion. Rendering helpers format
text output and create the `roundViews` model consumed by the HTML renderer.
`bracketHtml` uses Svelte's server renderer and the bracket components to
produce the HTML fragment described above.

Run the project's development checks from the repository directory:

```sh
bun run typecheck
bun run lint
bun run format:check
bun run test
```

See [LICENSE](LICENSE) for the MIT license.

---

Built with [BAKED](https://github.com/Gulliby-development/baked), an open-source coding agent (bench round R89).
