import { traceWithValue } from "fp-ts-std/Debug";
import { join } from 'fp-ts-std/ReadonlyArray';
import { flow, pipe } from "fp-ts/function";
import * as E from "fp-ts/lib/Either";
import { toEntries } from "fp-ts/lib/ReadonlyRecord";
import { snd } from "fp-ts/lib/ReadonlyTuple";
import * as S from 'fp-ts/lib/String';
import * as N from 'fp-ts/lib/number';
import * as A from 'fp-ts/ReadonlyArray';
import { readFileSync } from "fs";
import * as PC from "parser-ts/lib/char";
import * as P from "parser-ts/lib/Parser";
import { stream } from "parser-ts/lib/Stream";
import * as PS from "parser-ts/lib/string";

const file = readFileSync("./src/day7/input.txt", "utf-8");
const example = readFileSync("./src/day7/example.txt", "utf-8");

const chars = (s: string) => s.split('');

const command = (p) => pipe(PC.char('$'), P.chain(() => PS.string(' ')), P.chain(() => p));
const changeDir = PS.string('cd');
const doubleDot = PS.string('..');
const root = PS.string('/');
const fileSize = pipe(PC.many1(PC.digit));
const fileName = pipe(P.many1(PC.notSpace), P.map(x => x.join('')));
const dir = PS.string('dir');
const ls = PS.string('ls');
const dirName = pipe(P.many1(PC.notSpace), P.map(x => x.join('')));

const twoArgs: <First, Second>(first: P.Parser<string, First>, second: P.Parser<string, Second>) => P.Parser<string, {first: First, second: Second}> = (first, second) => pipe(
  first,
  P.bindTo('first'),
  P.chainFirst(() => PS.string(' ')),
  P.bind('second', () => second)
)

type Dir = {_tag: 'Dir', name: string};
type CdRoot = {_tag: 'CdRoot'};
type CdParent = {_tag: 'CdParent'};
type Cd = {_tag: 'Cd', name: string};
type Ls = {_tag: 'Ls' };
type File = {_tag: 'File', name: string, size: number};
type Model = Dir | CdRoot | CdParent | Cd | File | Ls;

const dirOutput: P.Parser<string, Dir> = pipe(twoArgs(dir, dirName), P.map(({second}) => ({_tag: 'Dir', name: second})));
const fileOutput: P.Parser<string, File> = pipe(twoArgs(fileSize, fileName), P.map(({first, second}) => ({_tag: 'File', name: second, size: parseInt(first)})));
const commandCdRoot: P.Parser<string, CdRoot> = pipe(command(twoArgs(changeDir, root)), P.map(() => ({_tag: 'CdRoot'})));
const commandCdParent: P.Parser<string, CdParent> = pipe(command(twoArgs(changeDir, doubleDot)), P.map(() => ({_tag: 'CdParent'})));
const commandCd: P.Parser<string, Cd> = pipe(command(twoArgs(changeDir, dirName)), P.map(({second}) => ({_tag: 'Cd', name: second})));
const commandLs: P.Parser<string, Ls> = pipe(command(ls), P.map(() => ({_tag: 'Ls'})));

const parseLine = pipe(
  fileOutput as P.Parser<string, Model>,
  P.alt((): P.Parser<string, Model> => dirOutput),
  P.alt((): P.Parser<string, Model> => commandCdRoot),
  P.alt((): P.Parser<string, Model> => commandCdParent),
  P.alt((): P.Parser<string, Model> => commandCd),
  P.alt((): P.Parser<string, Model> => commandLs),
)

const parseLines = pipe(
  P.sepBy(PS.string('\n'), parseLine)
)

const sumDirs = (dirs: readonly (readonly [string, number])[]) => (cwd) => pipe(dirs, A.filter(([dir]) => S.startsWith(cwd)(dir)), A.map(snd), A.reduce(0, N.SemigroupSum.concat));

pipe(
  example,
  flow(chars, stream),
  parseLines,
  E.match(
    (e) => ({}),
    (r) => A.reduce<Model, [Record<string, number>, string]>([{}, ''], ([dirs, cwd], command) => {
      switch(command._tag) {
        case 'CdRoot':   return [dirs, ''];
        case 'CdParent': return [dirs, pipe(cwd, S.split('/'), A.dropRight(1), join('/'))];
        case 'Cd':       return [dirs, `${cwd}/${command.name}`];
        case 'File':     return [{...dirs, [cwd === '' ? '/' : cwd]: dirs[cwd] ?? 0 + command.size}, cwd];
      }
      return [dirs, cwd]
    })(r.value)[0]
  ),
  toEntries,
  (entries) => pipe(entries, A.map(([key, _]) => ([key, sumDirs(entries)(key)])),
  traceWithValue('dirs'),
)



//assert(getEq(N.Eq).equals(some(10), solve(example)));
//assert(getEq(N.Eq).equals(some(29), solve(14)(example)));

//log("Solution day 7, part 1: " + pipe(solve(4)(file), getOrElse(() => -1)))();
//log("Solution day 7, part 2: " + pipe(solve(14)(file), getOrElse(() => -1)))();
