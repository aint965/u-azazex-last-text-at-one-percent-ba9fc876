// Verifier for the Last Text at One Percent entry.
//
// Runs main.ts twice into two different output directories, checks the
// two outputs are byte-identical (determinism), checks the text is
// 1-200 characters, valid UTF-8 and not only whitespace, and prints the
// text with its character and byte counts. Also runs main.ts once with
// the output directory on a tmpfs mount (/dev/shm) to prove it works
// on a mount, not just a plain directory.
//
// Usage: node verify.mjs   (run from the repository root)
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const repo = process.cwd();

function runMain(outDir) {
  execFileSync("node", ["main.ts"], {
    cwd: repo,
    env: { ...process.env, MAKEFUN_OUTPUT_DIR: outDir },
    stdio: "inherit",
  });
  return readFileSync(join(outDir, "entry.txt"));
}

function checkEntry(buf, label) {
  // Strict UTF-8: a round-trip through decode/encode must reproduce
  // the exact bytes, otherwise the file holds invalid UTF-8.
  const text = buf.toString("utf8");
  if (!Buffer.from(text, "utf8").equals(buf)) {
    throw new Error(`${label}: not valid UTF-8`);
  }
  const chars = [...text].length; // code points, as the gate counts characters
  const bytes = buf.length;
  if (chars < 1 || chars > 200) {
    throw new Error(`${label}: ${chars} characters, outside 1-200`);
  }
  if (text.trim().length === 0) {
    throw new Error(`${label}: text is only whitespace`);
  }
  console.log(`--- ${label} ---`);
  console.log(`text: ${JSON.stringify(text)}`);
  console.log(`characters: ${chars}  bytes: ${bytes}`);
  return { text, chars, bytes };
}

const dirA = mkdtempSync(join(tmpdir(), "verify-a-"));
const dirB = mkdtempSync(join(tmpdir(), "verify-b-"));
const dirTmpfs = mkdtempSync(join("/dev/shm", "verify-tmpfs-"));

try {
  const outA = runMain(dirA);
  const outB = runMain(dirB);
  const outTmpfs = runMain(dirTmpfs);

  if (!outA.equals(outB)) {
    throw new Error("FAIL: two runs are not byte-identical");
  }
  if (!outA.equals(outTmpfs)) {
    throw new Error("FAIL: tmpfs-mount run differs from plain-directory runs");
  }
  console.log("determinism: PASS (two runs byte-identical)");
  console.log("tmpfs mount run: PASS (output identical on /dev/shm)");

  const result = checkEntry(outA, "entry.txt");
  console.log("gate: PASS (1-200 chars, valid UTF-8, not only whitespace)");
  console.log(`\nfinal entry (${result.chars} chars, ${result.bytes} bytes):`);
  console.log(result.text);
} finally {
  for (const d of [dirA, dirB, dirTmpfs]) {
    try {
      rmSync(d, { recursive: true, force: true });
    } catch {
      // best-effort cleanup of our own temp dirs only
    }
  }
}
