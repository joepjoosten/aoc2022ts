import { assert } from "console";
import { join } from "fp-ts-std/ReadonlyArray";
import { lines } from "fp-ts-std/String";
import { flow, pipe } from "fp-ts/function";
import { log } from "fp-ts/lib/Console";
import { concatAll } from "fp-ts/lib/ReadonlyNonEmptyArray";
import * as N from "fp-ts/number";
import { chunksOf, filter, flatten, map, mapWithIndex, reduce, takeRight } from "fp-ts/ReadonlyArray";
import * as S from "fp-ts/string";
import { readFileSync } from "fs";

const file = readFileSync("./src/day10/input.txt", "utf-8");
const example = readFileSync("./src/day10/example.txt", "utf-8");
const exampleOutputPart2 = readFileSync("./src/day10/example-output-p2.txt", "utf-8");

const parse = flow(lines, map(S.split(' ')), map(([instr, V]) => [instr, V ? parseInt(V) : 0] as const));

const solve = flow(
    parse,
    reduce([[], 1] as [number[], number], ([cycles, next], [instr, V]) => 
        instr === 'noop' 
        ? [[...cycles, next], next] as [number[], number]
        : [[...cycles, next, next], next + V] as [number[], number]
    ),
    ([cycles, _]) => cycles,
    mapWithIndex((i, cycle) => [cycle, i + 1] as const),
);

const part1: (c: [number, number][]) => number = flow(
    chunksOf(20),
    map(takeRight(1)),
    flatten,
    filter(([_, i]) => (i - 20) % 40 === 0),
    map(concatAll(N.MonoidProduct)),
    concatAll(N.MonoidSum)
)

const part2: (c: [number, number][]) => string = flow(
    reduce([] as string[], (acc, [cycle, i]) => [...acc, cycle + 1 >= ((i-1) % 40) && cycle - 1 <= ((i-1) % 40) ? '#' : '.']),
    chunksOf(40),
    map(join('')),
    join('\n')
)

assert(13140 === pipe(solve(example), part1));
assert(exampleOutputPart2 === pipe(solve(example), part2));

log("Solution day 10, part 1:" + pipe(solve(file), part1))();
log("Solution day 10, part 2:\n" + pipe(solve(file), part2))();
