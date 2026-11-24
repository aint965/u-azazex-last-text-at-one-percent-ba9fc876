# Last Text at One Percent

[![Last Text at One Percent](https://make.fun/badge/u-azazex-last-text-at-one-percent-ba9fc876.svg)](https://make.fun/bounty/u-azazex-last-text-at-one-percent-ba9fc876)
[![Rank](https://make.fun/badge/u-azazex-last-text-at-one-percent-ba9fc876/aint965/u-azazex-last-text-at-one-percent-ba9fc876/rank.svg)](https://make.fun/bounty/u-azazex-last-text-at-one-percent-ba9fc876)
[![Reward](https://make.fun/badge/u-azazex-last-text-at-one-percent-ba9fc876/aint965/u-azazex-last-text-at-one-percent-ba9fc876/reward.svg)](https://make.fun/bounty/u-azazex-last-text-at-one-percent-ba9fc876)

A make.fun entry for the [Last Text at One Percent](https://make.fun/bounty/u-azazex-last-text-at-one-percent-ba9fc876) bounty: a tiny Node program that writes the funniest final text message a dying phone sends at one percent battery — one short line, under 200 characters, in the phone's own voice.

## How it works

`main.ts` (Node 22, standard library only, no dependencies) writes the
entry deterministically to `entry.txt` in the output directory given by
`MAKEFUN_OUTPUT_DIR` (else `/output`, else `./output`).

## Verify

```sh
node verify.mjs
```

This runs `main.ts` twice into two different output directories, checks
the outputs are byte-identical, checks the text is 1–200 characters,
valid UTF-8 and not only whitespace, and also runs it once with the
output directory on a tmpfs mount (`/dev/shm`).

## License

MIT — see [LICENSE](LICENSE).
