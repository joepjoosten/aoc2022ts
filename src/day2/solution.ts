import { assert } from "console";
import { log } from "fp-ts/lib/Console";
import { flow } from "fp-ts/lib/function";
import { concatAll, map } from "fp-ts/lib/ReadonlyNonEmptyArray";
import * as N from "fp-ts/number";
import * as S from "fp-ts/string";
import { readFileSync } from "fs";

const file = readFileSync("./src/day2/input.txt", "utf-8");
const example = readFileSync("./src/day2/example.txt", "utf-8");

const lines = S.split('\n');

const round1 = (s: string) => /(A Y)|(B Z)|(C X)/.test(s) ? 6 : /(A X)|(B Y)|(C Z)/.test(s) ? 3 : 0;
const shape1 = (s: string) => /X$/.test(s) ? 1 : /Y$/.test(s) ? 2 : 3;

const round2 = (s: string) => /X$/.test(s) ? 0 : /Y$/.test(s) ? 3 : 6;
const shape2 = (s: string) => /(A X)|(C Y)|(B Z)/.test(s) ? 3 : /(C X)|(B Y)|(A Z)/.test(s) ? 2 : 1;

const solution = (round, shape) => flow(
  lines,
  map(s => round(s) + shape(s)),
  concatAll(N.SemigroupSum)
);

assert(15 === solution(round1, shape1)(example));
assert(12 === solution(round2, shape2)(example));

log("Solution day 1, part 1: " + solution(round1, shape1)(file))();
log("Solution day 1, part 2: " + solution(round2, shape2)(file))();
