import { assert } from 'console';
import { fromString } from 'fp-ts-std/Number';
import { join, transpose } from 'fp-ts-std/ReadonlyArray';
import { log } from 'fp-ts/lib/Console';
import { flow, pipe, identity } from "fp-ts/lib/function";
import { chain, fromPredicate, getOrElse, map as omap } from 'fp-ts/lib/Option';
import { chunksOf, compact, concat, dropRight, flatten, lookup, map, modifyAt, reduce, reverse, takeRight } from "fp-ts/lib/ReadonlyArray";
import { fst, snd } from 'fp-ts/lib/ReadonlyTuple';
import * as S from "fp-ts/string";
import { readFileSync } from "fs";

const file = readFileSync("./src/day5/input.txt", "utf-8");
const example = readFileSync("./src/day5/example.txt", "utf-8");

const chars = S.split('');
const words = S.split(' ');
const lines = S.split('\n');
const separator = S.split('\n\n');

const stackLines = flow(separator, fst, lines, dropRight(1));
const parseStackLine = flow(chars, chunksOf(4), map(flow(lookup(1), chain(fromPredicate(s => s !== ' ')))));
const parseStack = flow(stackLines, map(parseStackLine), transpose, map(flow(compact, reverse)));

const movesLines = flow(separator, snd, lines);
const parseMoveLine = flow(words, map(fromString), compact, ([move, from, to]) => [move, from - 1, to - 1] as [number, number, number]);
const parseMoves = flow(movesLines, map(parseMoveLine));

const solve = (stack, crane: typeof reverse) => flow(
  reduce(stack, (acc, [move, from, to]) => pipe(
    acc, 
    lookup(from), 
    omap(takeRight(move)), 
    omap(crane),
    omap((moved) => pipe(modifyAt(to, concat(moved))(acc), getOrElse(() => acc))),
    omap((changed) => pipe(modifyAt(from, dropRight(move))(changed), getOrElse(() => acc))),
    getOrElse(() => acc)
  )),
  map(takeRight(1)),
  flatten,
  join('')
);

assert('CMZ' === solve(parseStack(example), reverse)(parseMoves(example)));
assert('MCD' === solve(parseStack(example), identity)(parseMoves(example)));


log("Solution day 5, part 1: " + solve(parseStack(file), reverse)(parseMoves(file)))();
log("Solution day 5, part 2: " + solve(parseStack(file), identity)(parseMoves(file)))();
