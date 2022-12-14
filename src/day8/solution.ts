import { assert } from "console";
import { traceWithValue } from "fp-ts-std/Debug";
import { NonEmptyString, reverse, unNonEmptyString } from "fp-ts-std/NonEmptyString";
import { aperture, join, transpose } from "fp-ts-std/ReadonlyArray";
import { lines, unlines } from "fp-ts-std/String";
import { flip, flow, pipe } from "fp-ts/function";
import { log } from "fp-ts/lib/Console";
import { left, right } from "fp-ts/lib/Either";
import { getEq, getOrElse, some } from "fp-ts/lib/Option";
import { head, map, max, reduce } from "fp-ts/lib/ReadonlyNonEmptyArray";
import { fst } from "fp-ts/lib/ReadonlyTuple";
import * as N from "fp-ts/number";
import { chainRecDepthFirst, dropLeft, filter, findIndex, match, matchLeft, size, takeLeft, uniq, zipWith, zip } from "fp-ts/ReadonlyArray";
import * as S from "fp-ts/string";
import { readFileSync } from "fs";
import { unsafeFromString } from 'fp-ts-std/NonEmptyString';

const file = readFileSync("./src/day8/input.txt", "utf-8");
const example = readFileSync("./src/day8/example.txt", "utf-8");
const zip2d = (xs, ys) => zipWith(xs, ys, zip);

const chars = S.split('');
const isVisible = (xs, y): number => max(N.Ord)(xs) < y ? 1 : 0;
const visableLine = (xs) => 
const parse = flow(lines, map(flow(chars, map(Number))));
const surround = (n: number) => (xs: readonly number[]) => ([n, ...xs, n]);

pipe(example, parse, map(flow(surround(-1), aperture(3), map(isVisible))), traceWithValue("visible"));

//assert(21 === solve(4)(example)));
//assert(getEq(N.Eq).equals(some(29), solve(14)(example)));

//log("Solution day 8, part 1: " + pipe(solve(4)(file), getOrElse(() => -1)))();
//log("Solution day 8, part 2: " + pipe(solve(14)(file), getOrElse(() => -1)))();
