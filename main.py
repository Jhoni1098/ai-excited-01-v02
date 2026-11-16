#!/usr/bin/env python3
"""ai-excited-01 entry 2 — "Neon Koi Leap".

Copies the prepared artwork (entry.png, JPEG bytes) to the output directory
so the judge sees it at /output/entry.png (or $MAKEFUN_OUTPUT_DIR).

The picture is the entry: a glowing neon koi bursting out of a phone screen
while a startled cat leaps away. This program only ferries the bytes, in
64 KiB blocks, then checks the result three ways before it exits:
the JPEG magic bytes are intact, the byte count matches the source, and the
SHA-256 of what landed equals the SHA-256 of what left.
"""

import hashlib
import os
import sys

BLOCK = 65536
JPEG_MAGIC = b"\xff\xd8\xff"


def die(message):
    print(f"entry: {message}", file=sys.stderr)
    sys.exit(1)


def main():
    here = os.path.dirname(os.path.abspath(__file__))
    source = os.path.join(here, "entry.png")
    out_dir = os.environ.get("MAKEFUN_OUTPUT_DIR") or "/output"
    target = os.path.join(out_dir, "entry.png")

    if not os.path.isfile(source):
        die(f"source image not found at {source}")
    wanted = os.path.getsize(source)

    os.makedirs(out_dir, exist_ok=True)
    digest = hashlib.sha256()
    moved = 0
    with open(source, "rb") as reader, open(target, "wb") as writer:
        while True:
            block = reader.read(BLOCK)
            if not block:
                break
            digest.update(block)
            writer.write(block)
            moved += len(block)

    if moved != wanted:
        die(f"short copy: wrote {moved} of {wanted} bytes")

    landed_size = os.path.getsize(target)
    if landed_size != wanted:
        die(f"output size drifted: {landed_size} vs source {wanted} bytes")
    landed = hashlib.sha256()
    with open(target, "rb") as check:
        head = check.read(3)
        check.seek(0)
        while True:
            block = check.read(BLOCK)
            if not block:
                break
            landed.update(block)
    landed = landed.hexdigest()
    if head != JPEG_MAGIC:
        die("output is not a JPEG (magic bytes wrong)")
    if landed != digest.hexdigest():
        die(f"copy mismatch: source {digest.hexdigest()} vs output {landed}")
    print(f"entry: wrote {target} ({moved} bytes, sha256 {landed})")


if __name__ == "__main__":
    main()
