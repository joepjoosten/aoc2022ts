import { assert } from "console";
import { minimum } from 'fp-ts-std/Array';
import { of } from "fp-ts-std/Lazy";
import { join } from 'fp-ts-std/ReadonlyArray';
import { lines, match } from 'fp-ts-std/String';
import { flow, pipe } from "fp-ts/function";
import { log } from "fp-ts/lib/Console";
import * as N from 'fp-ts/lib/number';
import { toEntries } from "fp-ts/lib/ReadonlyRecord";
import { fst, snd } from "fp-ts/lib/ReadonlyTuple";
import * as S from 'fp-ts/lib/String';
import * as O from 'fp-ts/Option';
import * as A from 'fp-ts/ReadonlyArray';
import { readFileSync } from "fs";

const file = readFileSync("./src/day7/input.txt", "utf-8");
const example = readFileSync("./src/day7/example.txt", "utf-8");

const lineRegex = /(?<CdParent>\$ cd \.\.)|(?<CdRoot>\$ cd \/)|(\$ cd (?<Cd>[^\.\/]+))|(?<Ls>\$ ls)|((?<FileSize>\d+) (?<FileName>.*))|(dir (?<DirName>[^\.\/]+))/;

const sumDirs = (dirs: readonly (readonly [string, number])[]) => (cwd) => 
  pipe(dirs, A.filter(([dir]) => S.startsWith(cwd)(dir)), A.map(snd), A.reduce(0, N.SemigroupSum.concat));

const solve = flow(
  flow(
    lines,
    A.map(flow(match(lineRegex), O.match(of({}), r => r.groups ?? {}), toEntries<string, string>, A.filter(a => snd(a) !== undefined))),
    A.flatten,
  ),
  A.reduce<[string, string], [Record<string, number>, string]>([{}, '/'], ([dirs, cwd], match) => {
    switch(fst(match)) {
      case 'CdRoot':   return [dirs, '/'];
      case 'CdParent': return [dirs, pipe(cwd, S.split('/'), A.dropRight(1), join('/'))];
      case 'Cd':       return [dirs, pipe(cwd, S.split('/'), A.append(snd(match)), join('/'))];
      case 'Ls':       return [{...dirs, [cwd]: 0}, cwd];
      case 'FileSize': return [{...dirs, [cwd]: dirs[cwd] + parseInt(snd(match), 10)}, cwd];
    }
    return [dirs, cwd]
  }),
  fst,
  toEntries<string, number>,
  (entries) => pipe(entries, A.map(([key, _]) => (sumDirs(entries)(key)))),
)

assert(95437 === pipe(example, solve, A.filter((size) => size <= 100_000), A.reduce(0, N.SemigroupSum.concat)));
assert(24933642 === pipe(example, solve, ([head, ...tail]) => pipe(tail, A.filter((size) => size >= 30_000_000 - (70_000_000 - head))), minimum(N.Ord)));

log("Solution day 7, part 1: " + pipe(file, solve, A.filter((size) => size <= 100_000), A.reduce(0, N.SemigroupSum.concat)))();
log("Solution day 7, part 1: " + pipe(file, solve, ([head, ...tail]) => pipe(tail, A.filter((size) => size >= 30_000_000 - (70_000_000 - head))), minimum(N.Ord)))();
