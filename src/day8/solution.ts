import { assert } from "console";
import { traceWithValue } from "fp-ts-std/Debug";
import { allM, aperture, countBy, maximum, minimum, transpose } from "fp-ts-std/ReadonlyArray";
import { lines } from "fp-ts-std/String";
import { flip, flow, pipe } from "fp-ts/function";
import { log } from "fp-ts/lib/Console";
import { fst } from "fp-ts/lib/ReadonlyTuple";
import * as N from "fp-ts/number";
import { dropRight, every, filter, flap, flatten, map, mapWithIndex, match, reduce, reverse, size, some, splitAt, zip, zipWith } from "fp-ts/ReadonlyArray";
import * as S from "fp-ts/string";
import { readFileSync } from "fs";

const file = readFileSync("./src/day8/input.txt", "utf-8");
const example = readFileSync("./src/day8/example.txt", "utf-8");

const chars = S.split('');
const wrap = fy => fx => flow(fy, fx, fy);
const flipZipWith = <A, B, C>(f: (a: A, b: B) => C) => (fa: readonly A[], fb: readonly B[]) => zipWith<A,B,C>(fa, fb, f)
const flipFlap = flip(flap)

const parse = flow(lines, map(flow(chars, map(Number))));

const viewFrom = (xs: readonly number[]) => mapWithIndex((i, x) => ([pipe(splitAt(i)(xs)[0], reverse), x, splitAt(i + 1)(xs)[1]] as [number[], number, number[]]))(xs)
const smallerThen = (x) => (y) => y < x;

const isVisibleFromOutside = ([xs, y, zs]) => every(smallerThen(y))(xs) || every(smallerThen(y))(zs) ? 1 : 0;
const scenisScore = ([xs, y, zs]) => 

const singleDirection = (f: (xs: [number[], number, number[]]) => number) => flow(
    map(viewFrom),
    map(map(f)),
);

const solve = (f, g) => (input: readonly (readonly number[])[]) => pipe(
    flipZipWith(zip<number, number>)(singleDirection(f)(input), pipe(input, transpose, singleDirection(f), transpose)),
    map(map(g))
);

assert(21 === pipe(parse(example), solve(isVisibleFromOutside, ([x, y]) => x === 1 || y === 1 ? 1 : 0), flatten, filter(x => x === 1), size));
//assert(getEq(N.Eq).equals(some(29), solve(14)(example)));

log("Solution day 8, part 1: " + pipe(parse(file), solve(isVisibleFromOutside, ([x, y]) => x === 1 || y === 1 ? 1 : 0), flatten, filter(x => x === 1), size))();
//log("Solution day 8, part 2: " + pipe(solve(14)(file), getOrElse(() => -1)))();
