// ai-excited-01 entry 2 — "Neon Koi Leap"
// Places the prepared artwork at /output/entry.png (or $MAKEFUN_OUTPUT_DIR).
// The picture itself is the entry: a glowing koi bursting out of a phone
// screen while a startled cat leaps away. This program only moves the bytes,
// streaming them in chunks so the whole file never sits in memory at once,
// then proves the copy is exact before it exits.

import { createHash } from "node:crypto";
import { createReadStream, createWriteStream, mkdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const CHUNK_BYTES = 64 * 1024;

function fail(message: string): never {
  console.error(`entry: ${message}`);
  process.exit(1);
}

function destinationDir(): string {
  const fromEnv = process.env.MAKEFUN_OUTPUT_DIR;
  if (fromEnv && fromEnv.trim().length > 0) return resolve(fromEnv);
  return "/output";
}

function sourcePath(): string {
  // entry.png ships beside this file in the repository.
  return join(dirname(fileURLToPath(import.meta.url)), "entry.png");
}

async function streamCopy(from: string, to: string): Promise<{ bytes: number; sha256: string }> {
  const digest = createHash("sha256");
  let bytes = 0;
  await new Promise<void>((done, reject) => {
    const reader = createReadStream(from, { highWaterMark: CHUNK_BYTES });
    const writer = createWriteStream(to);
    reader.on("data", (chunk: Buffer) => {
      bytes += chunk.length;
      digest.update(chunk);
    });
    reader.on("error", reject);
    writer.on("error", reject);
    writer.on("finish", () => done());
    reader.pipe(writer);
  });
  return { bytes, sha256: digest.digest("hex") };
}

function digestOfFile(path: string): string {
  // Small second pass over the written file: hash it back from disk so the
  // check covers what actually landed, not what we meant to write.
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

async function main(): Promise<void> {
  const src = sourcePath();
  const outDir = destinationDir();
  const out = join(outDir, "entry.png");

  let expected: number;
  try {
    expected = statSync(src).size;
  } catch {
    fail(`source image not found at ${src}`);
  }

  mkdirSync(outDir, { recursive: true });
  const copied = await streamCopy(src, out);
  if (copied.bytes !== expected) {
    fail(`short copy: wrote ${copied.bytes} of ${expected} bytes`);
  }
  const writtenDigest = digestOfFile(out);
  if (writtenDigest !== copied.sha256) {
    fail(`copy mismatch: source ${copied.sha256} vs output ${writtenDigest}`);
  }
  console.log(`entry: wrote ${out} (${copied.bytes} bytes, sha256 ${copied.sha256})`);
}

main().catch((error) => fail(error instanceof Error ? error.message : String(error)));
