import { assert } from "console";
import { traceWithValue } from "fp-ts-std/Debug";
import { countBy, maximum, minimum, transpose } from "fp-ts-std/ReadonlyArray";
import { lines } from "fp-ts-std/String";
import { flip, flow, pipe } from "fp-ts/function";
import { log } from "fp-ts/lib/Console";
import { fst } from "fp-ts/lib/ReadonlyTuple";
import * as N from "fp-ts/number";
import { dropRight, filter, flap, flatten, map, mapWithIndex, matchLeft, reduce, reverse, size, splitAt, zip, zipWith } from "fp-ts/ReadonlyArray";
import * as S from "fp-ts/string";
import { readFileSync } from "fs";

const file = readFileSync("./src/day8/input.txt", "utf-8");
const example = readFileSync("./src/day8/example.txt", "utf-8");

const chars = S.split('');
const wrap = fy => fx => flow(fy, fx, fy);
const flipZipWith = (f) => (xs, ys) => zipWith(xs, ys, f)
const flipFlap = flip(flap)

const parse = flow(lines, map(flow(chars, map(Number))));

const viewFrom = (xs) => mapWithIndex((i, _) => ([pipe(splitAt(i)(xs)[0], reverse), splitAt(i + 1)(xs)[1]]))(xs)

pipe(example, parse, traceWithValue('input'), map(viewFrom), fst, traceWithValue("viewFrom"));

const solve = (input) => pipe(
    [input, transpose(input)],
    flap(map(viewFrom)),
    traceWithValue("viewFrom"),
);

solve(parse(example));

//assert(21 === solve(parse(example)));
//assert(getEq(N.Eq).equals(some(29), solve(14)(example)));

//log("Solution day 8, part 1: " + solve(parse(file)))();
//log("Solution day 8, part 2: " + pipe(solve(14)(file), getOrElse(() => -1)))();
