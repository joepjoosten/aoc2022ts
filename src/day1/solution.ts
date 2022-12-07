import { assert } from "console";
import { ord } from "fp-ts";
import { log } from "fp-ts/Console";
import { flow, pipe } from "fp-ts/function";
import * as N from "fp-ts/number";
import { takeLeft } from "fp-ts/ReadonlyArray";
import { concatAll, head, map, sort } from "fp-ts/ReadonlyNonEmptyArray";
import * as S from "fp-ts/string";
import { readFileSync } from "fs";

const file = readFileSync("./src/day1/input.txt", "utf-8");
const example = readFileSync("./src/day1/example.txt", "utf-8");

const groups = S.split('\n\n');
const lines = S.split('\n');

const solve = (take: number) => flow(
  groups,
  map(flow(lines, map(Number), concatAll(N.SemigroupSum))),
  sort(ord.reverse(N.Ord)),
  takeLeft(take),
  concatAll(N.SemigroupSum)
);

assert(24000 === solve(1)(example));
assert(45000 === solve(3)(example));

log("Solution day 1, part 1: " + solve(1)(file))();
log("Solution day 1, part 2: " + pipe(solve(3)(file)))();

