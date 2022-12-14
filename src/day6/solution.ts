import { assert } from "console";
import { aperture } from "fp-ts-std/ReadonlyArray";
import { flow, pipe } from "fp-ts/function";
import { log } from "fp-ts/lib/Console";
import { getEq, getOrElse, map, some } from "fp-ts/lib/Option";
import * as N from "fp-ts/number";
import { findIndex, size, uniq } from "fp-ts/ReadonlyArray";
import * as S from "fp-ts/string";
import { readFileSync } from "fs";

const file = readFileSync("./src/day6/input.txt", "utf-8");
const example = readFileSync("./src/day6/example.txt", "utf-8");

const chars = S.split('');

const solve = (distinctChars) => flow(
  chars,
  aperture(distinctChars),
  findIndex(xs => pipe(xs, uniq(S.Eq), size) === distinctChars),
  map(x => x + distinctChars)
);

assert(getEq(N.Eq).equals(some(10), solve(4)(example)));
assert(getEq(N.Eq).equals(some(29), solve(14)(example)));

log("Solution day 6, part 1: " + pipe(solve(4)(file), getOrElse(() => -1)))();
log("Solution day 6, part 2: " + pipe(solve(14)(file), getOrElse(() => -1)))();
