// Last Text at One Percent — entry program (program/v1, Node 22).
//
// Writes exactly one text message — the last text a dying phone sends
// at one percent battery, in the phone's own voice — to entry.txt.
// Deterministic: the same text on every run. Dependency-free (Node
// standard library only) and far under the 60-second wall budget.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry. 89 characters, plain ASCII, no trailing newline: the file
// holds exactly this text and nothing else.
const ENTRY =
  "i've been at 1% for 40 minutes. i lied. this is the real goodbye. be nice to the next one.";

// Candidate lines considered (with one-line verdicts) live in the build
// notes; this is the winner after two revision rounds:
//   Round 1 — picked "i've been at 1% for 40 minutes. i was lying. this is
//   the real goodbye. don't cry — you have a laptop." Defect: the ending
//   "don't cry — you have a laptop" is generic comfort, not the phone's
//   voice. Fix: end on the phone's own stake in dying — its successor:
//   "be nice to the next one."
//   Round 2 — defect: "i was lying" is soft, past-continuous filler; a
//   dying phone confessing in a text would be blunt. Fix: "i lied."
//   (also drops 6 wasted characters and sharpens the turn).

const CANDIDATES = [
  process.env.MAKEFUN_OUTPUT_DIR,
  "/output",
  "./output",
].filter((d): d is string => typeof d === "string" && d.length > 0);

let written = false;
let lastError: unknown = null;
for (const dir of CANDIDATES) {
  try {
    // mkdirSync only (recursive). Never delete the output directory:
    // in the grading sandbox it is a mount, and a delete there fails.
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "entry.txt"), ENTRY, "utf8");
    written = true;
    break;
  } catch (err) {
    lastError = err;
  }
}

if (!written) {
  throw new Error(
    `could not write entry.txt: ${lastError instanceof Error ? lastError.message : String(lastError)}`,
  );
}
