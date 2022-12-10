import { assert } from "console";
import { minimum } from 'fp-ts-std/Array';
import { join } from 'fp-ts-std/ReadonlyArray';
import { flow, pipe } from "fp-ts/function";
import { log } from "fp-ts/lib/Console";
import * as E from "fp-ts/lib/Either";
import * as N from 'fp-ts/lib/number';
import { toEntries } from "fp-ts/lib/ReadonlyRecord";
import { snd } from "fp-ts/lib/ReadonlyTuple";
import * as S from 'fp-ts/lib/String';
import * as A from 'fp-ts/ReadonlyArray';
import { readFileSync } from "fs";
import { char, digit, notSpace } from "parser-ts/lib/char";
import { alt, bind, bindTo, chain, chainFirst, many1, map, Parser, sepBy } from "parser-ts/lib/Parser";
import { stream } from "parser-ts/lib/Stream";
import { string } from "parser-ts/lib/string";

type Dir = {_tag: 'Dir', name: string};
type CdRoot = {_tag: 'CdRoot'};
type CdParent = {_tag: 'CdParent'};
type Cd = {_tag: 'Cd', name: string};
type Ls = {_tag: 'Ls' };
type File = {_tag: 'File', name: string, size: number};
type Model = Dir | CdRoot | CdParent | Cd | File | Ls;

const file = readFileSync("./src/day7/input.txt", "utf-8");
const example = readFileSync("./src/day7/example.txt", "utf-8");

const chars = (s: string) => s.split('');

const command = (p) => pipe(char('$'), chain(() => string(' ')), chain(() => p));
const changeDir = string('cd');
const doubleDot = string('..');
const root = string('/');
const fileSize = pipe(many1(digit), map(x => x.join('')), map(Number));
const fileName = pipe(many1(notSpace),map(x => x.join('')));
const dir = string('dir');
const ls = string('ls');
const dirName = pipe(many1(notSpace),map(x => x.join('')));

const twoArgs: <First, Second>(first:Parser<string, First>, second:Parser<string, Second>) =>Parser<string, {first: First, second: Second}> = (first, second) => pipe(
  first,
  bindTo('first'),
  chainFirst(() => string(' ')),
  bind('second', () => second)
)

const dirOutput: Parser<string, Model> = pipe(twoArgs(dir, dirName), map(({second}) => ({_tag: 'Dir', name: second})));
const fileOutput: Parser<string, Model> = pipe(twoArgs(fileSize, fileName), map(({first, second}) => ({_tag: 'File', name: second, size: first})));
const commandCdRoot: Parser<string, Model> = pipe(command(twoArgs(changeDir, root)), map(() => ({_tag: 'CdRoot'})));
const commandCdParent: Parser<string, Model> = pipe(command(twoArgs(changeDir, doubleDot)),map(() => ({_tag: 'CdParent'})));
const commandCd: Parser<string, Model> = pipe(command(twoArgs(changeDir, dirName)), map(({second}) => ({_tag: 'Cd', name: second})));
const commandLs: Parser<string, Model> = pipe(command(ls), map(() => ({_tag: 'Ls'})));

const parseLine = pipe(
  fileOutput,
  alt(() => dirOutput),
  alt(() => commandCdRoot),
  alt(() => commandCdParent),
  alt(() => commandCd),
  alt(() => commandLs),
)

const sumDirs = (dirs: readonly (readonly [string, number])[]) => (cwd) => 
  pipe(dirs, A.filter(([dir]) => S.startsWith(cwd)(dir)), A.map(snd), A.reduce(0, N.SemigroupSum.concat));

const solve = flow(
  chars, stream,  pipe(sepBy(string('\n'), parseLine)),
  E.match(
    (e) => ({}),
    (r) => A.reduce<Model, [Record<string, number>, string]>([{}, '/'], ([dirs, cwd], model) => {
      switch(model._tag) {
        case 'CdRoot':   return [dirs, '/'];
        case 'CdParent': return [dirs, pipe(cwd, S.split('/'), A.dropRight(1), join('/'))];
        case 'Cd':       return [dirs, `${cwd}/${model.name}`];
        case 'Ls':       return [{...dirs, [cwd]: 0}, cwd];
        case 'File':     return [{...dirs, [cwd]: dirs[cwd] + model.size}, cwd];
      }
      return [dirs, cwd]
    })(r.value)[0]
  ),
  toEntries<string, number>,
  (entries) => pipe(entries, A.map(([key, _]) => (sumDirs(entries)(key))))
)

assert(95437 === pipe(example, solve, A.filter((size) => size <= 100_000), A.reduce(0, N.SemigroupSum.concat)));
assert(24933642 === pipe(example, solve, ([head, ...tail]) => pipe(tail, A.filter((size) => size >= 30_000_000 - (70_000_000 - head))), minimum(N.Ord)));

log("Solution day 7, part 1: " + pipe(file, solve, A.filter((size) => size <= 100_000), A.reduce(0, N.SemigroupSum.concat)))();
log("Solution day 7, part 1: " + pipe(file, solve, ([head, ...tail]) => pipe(tail, A.filter((size) => size >= 30_000_000 - (70_000_000 - head))), minimum(N.Ord)))();
