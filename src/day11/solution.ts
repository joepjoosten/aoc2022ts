import { flow, identity, pipe } from "fp-ts/lib/function";
import { readFileSync } from "fs";
import { char, digit, notSpace } from "parser-ts/lib/char";
import { alt, bind, bindTo, chain, chainFirst, either, many1, map, Parser, sepBy } from "parser-ts/lib/Parser";
import { stream } from "parser-ts/lib/Stream";
import { string } from "parser-ts/lib/string";
import * as N from 'fp-ts/lib/number';
import { traceWithValue } from "fp-ts-std/Debug";
import * as E from "fp-ts/lib/Either";
import { fst } from "fp-ts/lib/ReadonlyTuple";

const file = readFileSync("./src/day11/input.txt", "utf-8");
const example = readFileSync("./src/day11/example.txt", "utf-8");

const chars = (s: string) => s.split('');
const number = pipe(many1(digit), map(x => x.join('')), map(Number))
const constant = pipe(many1(digit), map(x => x.join('')), map(Number), map(x => (_: number) => x));
const variable = pipe(string('old'), map(x => identity<number>));
const mul = pipe(string(' * '), map(() => N.SemigroupProduct));
const add = pipe(string(' + '), map(() => N.SemigroupSum));

const startItems = pipe(string('Monkey '), chain(() => many1(digit)), chain(() => string(':\n  Starting items: ')), chain(() => pipe(sepBy(string(', '), number))));
const operation = pipe(
    pipe(string('  Operation: new = '), chain(() => either(constant, () => variable))),
    bindTo('left'),
    bind('op', () => pipe(mul, alt(() => add))),
    bind('right', () => either(constant, () => variable)),
    map(({left, op, right}) => (x: number) => Math.floor(op.concat(left(x), right(x)) / 3))
);
const predicate = pipe(string('  Test: divisible by '), chain(() => number), map((x) => (_: number) => _ % x === 0));
const onTrue = pipe(string('    If true: throw to monkey '), chain(() => number));
const onFalse = pipe(string('    If false: throw to monkey '), chain(() => number));

const parseMonkey = pipe(
    startItems,
    bindTo('startItems'), chainFirst(() => string('\n')),
    bind('operation', () => operation), chainFirst(() => string('\n')),
    bind('predicate', () => predicate), chainFirst(() => string('\n')),
    bind('onTrue', () => onTrue), chainFirst(() => string('\n')),
    bind('onFalse', () => onFalse)
)

const parse = flow(
    chars, stream, pipe(sepBy(string('\n\n'), parseMonkey)),
    E.match((e) => {throw e}, ({value}) => value),
    traceWithValue('monkey')
)

parse(example);
//assert(13140 === pipe(solve(example), part1));
//assert(exampleOutputPart2 === pipe(solve(example), part2));

//log("Solution day 11, part 1:" + pipe(solve(file), part1))();
//log("Solution day 11, part 2:\n" + pipe(solve(file), part2))();
