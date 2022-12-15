import { assert } from "console";
import { traceWithValue } from "fp-ts-std/Debug";
import { countBy, maximum, minimum, transpose } from "fp-ts-std/ReadonlyArray";
import { lines } from "fp-ts-std/String";
import { flip, flow, pipe } from "fp-ts/function";
import { log } from "fp-ts/lib/Console";
import * as N from "fp-ts/number";
import { dropRight, filter, flap, flatten, map, matchLeft, reduce, reverse, size, zip, zipWith } from "fp-ts/ReadonlyArray";
import * as S from "fp-ts/string";
import { readFileSync } from "fs";

const file = readFileSync("./src/day8/input.txt", "utf-8");
const example = readFileSync("./src/day8/example.txt", "utf-8");

const chars = S.split('');
const wrap = fy => fx => flow(fy, fx, fy);
const flipZipWith = (f) => (xs, ys) => zipWith(xs, ys, f)
const flipFlap = flip(flap)

const parse = flow(lines, map(flow(chars, map(Number))));

const lineOfSightMax: (xs: readonly number[]) => readonly number[] = flow(reduce<number, readonly number[]>([], (acc, x) => size(acc) === 0 ? [-1, x] : [...acc, maximum(N.Ord)([x, ...acc])]), dropRight(1));

const fromLeft = (f) => map(f);
const fromRight = (f) => flow(wrap(map(reverse))(map(f)))
const fromUp = (f) => flow(wrap(transpose)(map(f)))
const fromDown = (f) => flow(wrap(transpose)(wrap(map(reverse))(map(f))))

const solve = (input) => pipe(
    input,
    flipFlap(flap(lineOfSightMax)([fromLeft, fromRight, fromUp, fromDown])), 
    ([x, ...xs]) => reduce(x, flipZipWith(flipZipWith(Math.min)))(xs),
    (xs) => flipZipWith(zip)(input, xs),
    flatten,
    filter(([x, y]) => x > y),
    size
);

assert(21 === solve(parse(example)));
//assert(getEq(N.Eq).equals(some(29), solve(14)(example)));

log("Solution day 8, part 1: " + solve(parse(file)))();
//log("Solution day 8, part 2: " + pipe(solve(14)(file), getOrElse(() => -1)))();
