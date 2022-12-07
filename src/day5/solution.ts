import { trace, traceWithValue } from 'fp-ts-std/Debug';
import { fromString } from 'fp-ts-std/Number';
import { transpose } from 'fp-ts-std/ReadonlyArray';
import { log } from 'fp-ts/lib/Console';
import { flow, pipe } from "fp-ts/lib/function";
import { fromPredicate, getOrElse, map as omap, compact as ocompact, flatten, some } from 'fp-ts/lib/Option';
import { compact, concat, dropRight, lookup, modifyAt, reduce, takeLeft, takeRight } from "fp-ts/lib/ReadonlyArray";
import { chunksOf, map, reverse } from "fp-ts/lib/ReadonlyNonEmptyArray";
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
const movesLines = flow(separator, snd, lines);

const parseStackLine = flow(chars, chunksOf(4), map(flow(lookup(1), omap(fromPredicate(s => s !== ' ')))), compact);
const parseMoveLine = flow(words, map(fromString), compact, ([move, from, to]) => [move, from - 1, to - 1]);

const parseStack = flow(stackLines, map(parseStackLine), transpose, map(flow(compact, reverse)));
const parseMoves = flow(movesLines, map(parseMoveLine));

const solve = (stack) => reduce(some(stack), (s, [move, from, to]) => pipe(
  s, 
  traceWithValue(`move: ${move}, from: ${from}, to: ${to}`),
  omap(modifyAt(to, concat(takeRight(move)(pipe(lookup(from)(pipe(s, getOrElse(() => []))), getOrElse(() => [])))))),
  omap(modifyAt(from, takeLeft(move))),
  traceWithValue("sss"),
));

log(solve(parseStack(example))(parseMoves(example)))();
//assert(2 === flow(lines, solution)(example));
//assert(4 === flow(lines, solution))(example));

//log("Solution day 5, part 1: " + flow(lines, solution(overlap))(file))();
//log("Solution day 5, part 2: " + flow(lines, solution(nooverlap))(file))();
