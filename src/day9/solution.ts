import { assert } from "console";
import { lines } from "fp-ts-std/String";
import { flow, pipe } from "fp-ts/function";
import { matchLeft } from "fp-ts/lib/Array";
import { log } from "fp-ts/lib/Console";
import { tuple } from "fp-ts/lib/Eq";
import { size } from "fp-ts/lib/ReadonlySet";
import { fromArray } from "fp-ts/lib/Set";
import * as N from "fp-ts/number";
import { flatten, map, reduce, replicate } from "fp-ts/ReadonlyArray";
import * as S from "fp-ts/string";
import { readFileSync } from "fs";

const file = readFileSync("./src/day9/input.txt", "utf-8");
const example = readFileSync("./src/day9/example.txt", "utf-8");

type Knot = [number, number];
const eqKnot = tuple(N.Eq, N.Eq);

const parse = flow(lines, map(S.split(' ')), map(([motion, count]) => replicate(parseInt(count), motion)), flatten);

const delta = ([x1, y1]: Knot) => ([x2, y2]: Knot) => [x1 - x2, y1 - y2];
const moveHead = (motion: string) => ([x, y]: Knot): Knot => motion === 'U' ? [x, y + 1] : motion === 'D' ? [x, y - 1] : motion === 'L' ? [x - 1, y] : [x + 1, y];
const moveKnot = (previous: Knot) => (current: Knot): Knot => pipe(
    delta(previous)(current), 
    ([x, y]) => Math.abs(x) < 2 && Math.abs(y) < 2 ? current : [current[0] + Math.sign(x), current[1] + Math.sign(y)]
)
const moveKnots = (first: Knot, rest: Knot[]) => [first, ...(matchLeft<Knot[], Knot>(() => [], (nextKnot, knots) => moveKnots(moveKnot(first)(nextKnot), knots))(rest))]

const solve = (knotLength) => flow(
    parse,
    reduce([[], replicate<Knot>(knotLength, [0, 0])] as [Knot[], Knot[]], ([lastKnots, [head, ...rest]], motion) => {
        const next = moveKnots(moveHead(motion)(head), rest);
        return [[...lastKnots, next[knotLength-1]], next] as [Knot[], Knot[]];
    }),
    ([tails, _]) => tails,
    fromArray<Knot>(eqKnot),
    size
);

assert(13 === solve(2)(example));
assert(36 === solve(10)('R 5\nU 8\nL 8\nD 3\nR 17\nD 10\nL 25\nU 20'));

log("Solution day 9, part 1: " + solve(2)(file))();
log("Solution day 9, part 2: " + solve(10)(file))();
