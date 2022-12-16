import { assert } from "console";
import { traceWithValue } from "fp-ts-std/Debug";
import { allM, aperture, countBy, maximum, minimum, transpose } from "fp-ts-std/ReadonlyArray";
import { lines } from "fp-ts-std/String";
import { flip, flow, pipe } from "fp-ts/function";
import { log } from "fp-ts/lib/Console";
import { fst } from "fp-ts/lib/ReadonlyTuple";
import * as N from "fp-ts/number";
import { dropRight, every, filter, flap, flatten, map, mapWithIndex, matchLeft, reduce, reverse, size, some, splitAt, zip, zipWith } from "fp-ts/ReadonlyArray";
import * as S from "fp-ts/string";
import { readFileSync } from "fs";

const file = readFileSync("./src/day8/input.txt", "utf-8");
const example = readFileSync("./src/day8/example.txt", "utf-8");

const chars = S.split('');
const wrap = fy => fx => flow(fy, fx, fy);
const flipZipWith = (f) => (xs, ys) => zipWith(xs, ys, f)
const flipFlap = flip(flap)

const parse = flow(lines, map(flow(chars, map(Number))));

const viewFrom = (xs: readonly number[]): [readonly number[], number, readonly number[]] => mapWithIndex((i, x) => ([pipe(splitAt(i)(xs)[0], reverse), x, splitAt(i + 1)(xs)[1]]))(xs)
const smallerThen = (x) => (y) => y < x;

const solve = (input: readonly (readonly number[])[]) => pipe(
    input,
    map(viewFrom),
    traceWithValue("views"),
    map(map((([xs, y, zs]) => every(smallerThen(y))(xs) || every(smallerThen(y))(zs) ? 1 : 0))),
    traceWithValue("parsed"),
);

solve(parse(example));

//assert(21 === solve(parse(example)));
//assert(getEq(N.Eq).equals(some(29), solve(14)(example)));

//log("Solution day 8, part 1: " + solve(parse(file)))();
//log("Solution day 8, part 2: " + pipe(solve(14)(file), getOrElse(() => -1)))();
