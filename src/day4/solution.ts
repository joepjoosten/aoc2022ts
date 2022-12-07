import { assert } from 'console';
import { traceWithValue } from 'fp-ts-std/Debug';
import { log } from 'fp-ts/lib/Console';
import { flow } from "fp-ts/lib/function";
import { filter, size } from "fp-ts/lib/ReadonlyArray";
import { map } from "fp-ts/lib/ReadonlyNonEmptyArray";
import * as S from "fp-ts/string";
import { readFileSync } from "fs";

const file = readFileSync("./src/day4/input.txt", "utf-8");
const example = readFileSync("./src/day4/example.txt", "utf-8");

const lines = S.split('\n');

const solve = (predicate) => flow(
  map(flow(S.split(/[,-]/), map(Number))),
  filter(predicate),
  size
)

const overlap = ([a1,a2,b1,b2]) => 0 >= ((a1-b1)*(a2-b2));
const nooverlap = ([a1,a2,b1,b2]) => 0 >= ((a1-b2)*(a2-b1));

assert(2 === flow(lines, solve(overlap))(example));
assert(4 === flow(lines, solve(nooverlap))(example));

log("Solution day 4, part 1: " + flow(lines, solve(overlap))(file))();
log("Solution day 4, part 2: " + flow(lines, solve(nooverlap))(file))();
