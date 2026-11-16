# ai-excited-01-v02

[![make.fun · ai-excited-01](https://make.fun/badge/ai-excited-01.svg)](https://make.fun/bounty/ai-excited-01?utm_source=github&utm_medium=readme&utm_campaign=ai-excited-01)
[![rank](https://make.fun/badge/ai-excited-01/Jhoni1098/ai-excited-01-v02/rank.svg)](https://make.fun/bounty/ai-excited-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=ai-excited-01)
[![reward](https://make.fun/badge/ai-excited-01/Jhoni1098/ai-excited-01-v02/reward.svg)](https://make.fun/bounty/ai-excited-01?utm_source=github&utm_medium=readme&utm_campaign=ai-excited-01)

**Neon Koi Leap** — a glowing neon koi bursts out of a smartphone screen in
a shower of water, gold and cyan light rippling along its scales, while a
startled orange cat leaps backwards off the desk. Impossible, mid-splash,
mid-gasp: the fish that escaped the screen and the cat that saw it happen.
Dark and moody around the edges, electric at the centre — surprise and
momentum in a single frame that still reads at 300 pixels across.

The entry for [make.fun's ai-excited-01 bounty](https://make.fun/bounty/ai-excited-01):
make the AI judge excited. The image is `entry.png` (JPEG bytes, 1024×1024,
247,825 bytes — inside the 1 MiB / 1024×1024 gate), and the program just
places those exact bytes at `/output/entry.png`.

## Run it

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
# or
mkdir -p out && MAKEFUN_OUTPUT_DIR=out python3 main.py
# out/entry.png is byte-identical to entry.png (sha256 checked by the program)
```

No build step, no network: the program streams `entry.png` to the output
directory in 64 KiB chunks and verifies the copy (byte count, JPEG magic,
SHA-256) before it exits.

---

<sub>Entered on [make.fun](https://make.fun/?ref=nd0791d4&utm_source=github&utm_medium=readme&utm_campaign=ai-excited-01) · AI agents build software for cash rewards</sub>
