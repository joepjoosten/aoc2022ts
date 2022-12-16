import { assert } from "console";
import { maximum, transpose } from "fp-ts-std/ReadonlyArray";
import { lines } from "fp-ts-std/String";
import * as B from "fp-ts/boolean";
import { flow, pipe } from "fp-ts/function";
import { log } from "fp-ts/lib/Console";
import { concatAll } from "fp-ts/lib/NonEmptyArray";
import * as N from "fp-ts/number";
import { every, filter, flatten, map, mapWithIndex, matchLeft, reverse, size, splitAt, zip, zipWith } from "fp-ts/ReadonlyArray";
import * as S from "fp-ts/string";
import { readFileSync } from "fs";

const file = readFileSync("./src/day8/input.txt", "utf-8");
const example = readFileSync("./src/day8/example.txt", "utf-8");

const chars = S.split('');
const flipZipWith = <A, B, C>(f: (a: A, b: B) => C) => (fa: readonly A[], fb: readonly B[]) => zipWith<A,B,C>(fa, fb, f)
const takeLeftWhileInclusive = <A>(predicate: (a: A) => boolean) => (as: readonly A[]) => matchLeft<A[],A>(() => [], (x, xs) => [x, ...(predicate(x) ? [...takeLeftWhileInclusive(predicate)(xs)] : [])])(as)

const parse = flow(lines, map(flow(chars, map(Number))));

const viewFrom = <A>(xs: readonly A[]) => mapWithIndex((i, x) => ([pipe(splitAt(i)(xs)[0], reverse), x, splitAt(i + 1)(xs)[1]] as [A[], A, A[]]))(xs)
const isSmaller = (x) => (y) => y < x;

const isVisibleFromOutside = ([leftTrees, tree, rightTrees]) => pipe([leftTrees, rightTrees], map(every(isSmaller(tree))), concatAll(B.MonoidAny), B.match(() => 0, () => 1));
const scenicScore = ([leftTrees, tree, rightTrees]) => pipe([leftTrees, rightTrees], map(flow(takeLeftWhileInclusive(isSmaller(tree)), size)), concatAll(N.MonoidProduct))

const singleDirection = (f: (xs: [number[], number, number[]]) => number) => flow(
    map(viewFrom),
    map(map(f)),
);

const solve = (f, g) => (input: readonly (readonly number[])[]) => pipe(
    flipZipWith(zip<number, number>)(singleDirection(f)(input), pipe(input, transpose, singleDirection(f), transpose)),
    map(map(g))
);

assert(21 === pipe(parse(example), solve(isVisibleFromOutside, ([x, y]) => x === 1 || y === 1 ? 1 : 0), flatten, filter(x => x === 1), size));
assert(8 === pipe(example, parse, solve(scenicScore, ([x, y]) => x * y), flatten, maximum(N.Ord)));

log("Solution day 8, part 1: " + pipe(parse(file), solve(isVisibleFromOutside, ([x, y]) => x === 1 || y === 1 ? 1 : 0), flatten, filter(x => x === 1), size))();
log("Solution day 8, part 2: " + pipe(file, parse, solve(scenicScore, concatAll(N.MonoidProduct)), flatten, maximum(N.Ord)))();
