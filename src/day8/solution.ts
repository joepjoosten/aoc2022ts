import { assert } from "console";
import { traceWithValue } from "fp-ts-std/Debug";
import { NonEmptyString, unNonEmptyString } from "fp-ts-std/NonEmptyString";
import { aperture, transpose, maximum } from "fp-ts-std/ReadonlyArray";
import { lines, unlines } from "fp-ts-std/String";
import { flip, flow, pipe } from "fp-ts/function";
import { log } from "fp-ts/lib/Console";
import { left, right } from "fp-ts/lib/Either";
import { getEq, getOrElse, some } from "fp-ts/lib/Option";
import { head } from "fp-ts/lib/ReadonlyNonEmptyArray";
import { fst } from "fp-ts/lib/ReadonlyTuple";
import * as N from "fp-ts/number";
import { chainRecDepthFirst, dropLeft, reverse, findIndex, map, matchLeft, size, reduce, zipWith, zip, dropRight } from "fp-ts/ReadonlyArray";
import * as S from "fp-ts/string";
import { readFileSync } from "fs";
import { unsafeFromString } from 'fp-ts-std/NonEmptyString';

const file = readFileSync("./src/day8/input.txt", "utf-8");
const example = readFileSync("./src/day8/example.txt", "utf-8");

const chars = S.split('');
const isVisible = (xs, y): number => maximum(N.Ord)(xs) < y ? 1 : 0;
const previousMaximum = flow(reduce<number, readonly number[]>([], (acc, x) => size(acc) === 0 ? [-1, x] : [...acc, maximum(N.Ord)([x, ...acc])]), dropRight(1));
const zip2d = (xs, ys) => zipWith(xs, ys, zip);
const wrap = y => x => flow(y, x, y);
const parse = flow(lines, map(flow(chars, map(Number))));


pipe(example, parse, map(flow(previousMaximum)), traceWithValue("visible"));
pipe(example, parse, wrap(map(reverse))(map(previousMaximum)), traceWithValue("visible"));
pipe(example, parse, wrap(transpose)(map(flow(previousMaximum))), traceWithValue("visible"));
pipe(example, parse, wrap(transpose)(wrap(map(reverse))(map(flow(previousMaximum)))), traceWithValue("visible"));

//assert(21 === solve(4)(example)));
//assert(getEq(N.Eq).equals(some(29), solve(14)(example)));

//log("Solution day 8, part 1: " + pipe(solve(4)(file), getOrElse(() => -1)))();
//log("Solution day 8, part 2: " + pipe(solve(14)(file), getOrElse(() => -1)))();
