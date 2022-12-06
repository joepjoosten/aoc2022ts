import { assert } from 'console';
import { traceWithValue } from 'fp-ts-std/Debug';
import { head } from 'fp-ts-std/NonEmptyString';
import { log } from 'fp-ts/lib/Console';
import { flow, pipe } from "fp-ts/lib/function";
import { compact, dropRight, filter, partitionMap, size } from "fp-ts/lib/ReadonlyArray";
import { bind, chunksOf, Do, flatten, map, reverse } from "fp-ts/lib/ReadonlyNonEmptyArray";
import { fst, snd } from 'fp-ts/lib/ReadonlyTuple';
import * as S from "fp-ts/string";
import * as N from "fp-ts/number";
import * as E from "fp-ts/Either";
import { readFileSync } from "fs";
import { transpose } from 'fp-ts-std/ReadonlyArray';
import { none, some } from 'fp-ts/lib/Option';
import { fromString } from 'fp-ts-std/Number';

const file = readFileSync("./src/day5/input.txt", "utf-8");
const example = readFileSync("./src/day5/example.txt", "utf-8");

const chars = S.split('');
const words = S.split(' ');
const lines = S.split('\n');

const stackLines = (input) => pipe(input, S.split('\n\n'), fst, lines, dropRight(1));
const movesLines = (input) => pipe(input, S.split('\n\n'), snd, lines);

const parseStackLine = flow(chars, chunksOf(4), map(stackItems => S.Eq.equals(stackItems[1], ' ') ? none : some(stackItems[1])));
const parseMoveLine = flow(words, map(fromString), compact);

const parseStack = (input: string) => pipe(stackLines(input), map(parseStackLine), transpose, map(flow(compact, reverse)));
const parseMoves = (input: string) => pipe(movesLines(input), map(parseMoveLine));

const parse  = (input: string) => pipe(
  Do,
  bind('stack', () => pipe(
    stackLines(input),
    map(parseStackLine),
    transpose,
    map(flow(compact, reverse)),
  )),
  bind('moves', () => pipe(movesLines(input), map(parseMoveLine))),

  traceWithValue("parse"),
)

parse(example);
//assert(2 === flow(lines, solution)(example));
//assert(4 === flow(lines, solution))(example));

//log("Solution day 5, part 1: " + flow(lines, solution(overlap))(file))();
//log("Solution day 5, part 2: " + flow(lines, solution(nooverlap))(file))();
