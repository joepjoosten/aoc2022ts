import { transpose } from 'fp-ts-std/ReadonlyArray';
import { traceWithValue } from 'fp-ts-std/Debug';
import { flow, pipe } from "fp-ts/lib/function";
import { compact, every, filter, findIndex, size } from "fp-ts/lib/ReadonlyArray";
import { chunksOf, concatAll, flatten, map, ReadonlyNonEmptyArray } from "fp-ts/lib/ReadonlyNonEmptyArray";
import * as S from "fp-ts/string";
import * as N from "fp-ts/number";
import { readFileSync } from "fs";
import { assert } from 'console';
import { log } from 'fp-ts/lib/Console';
import { lines } from 'fp-ts-std/String';

const file = readFileSync("./src/day3/input.txt", "utf-8");
const example = readFileSync("./src/day3/example.txt", "utf-8");

const chars = S.split('');
const compartments = (s) => pipe(s, chunksOf(s.length / 2));

const items = chars(' abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'); //offset by space so a starts at index 1

const countItem = (i) => flow(filter(s => s === i), size);
const countItems = (vs) => (xs) => pipe(flow(map(countItem))(vs), map(x => x(xs)));

const solve = (n) => flow(
  map(countItems(items)),
  chunksOf(n),
  map(flow(transpose, findIndex(every((x) => x > 0)))),
  compact,
  concatAll(N.SemigroupSum)
)

assert(157 === flow(lines, map(chars), map(compartments), flatten, solve(2))(example));
assert(70 === flow(lines, map(chars), solve(3))(example));

log("Solution day 3, part 1: " +  flow(lines, map(chars), map(compartments), flatten, solve(2))(file))();
log("Solution day 3, part 2: " + flow(lines, map(chars), solve(3))(file))();
