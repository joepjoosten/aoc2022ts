import { assert } from "console";
import { flow, pipe } from "fp-ts/function";
import { log } from "fp-ts/lib/Console";
import { left, right } from "fp-ts/lib/Either";
import { getEq, getOrElse, map, some } from "fp-ts/lib/Option";
import * as N from "fp-ts/number";
import { chainRecDepthFirst, dropLeft, filter, findIndex, match, size, takeLeft, uniq } from "fp-ts/ReadonlyArray";
import * as S from "fp-ts/lib/string";
import * as P from "parser-ts/lib/Parser";
import * as PS from "parser-ts/lib/string";
import * as PC from "parser-ts/lib/char";
import { readFileSync } from "fs";

const file = readFileSync("./src/day7/input.txt", "utf-8");
const example = readFileSync("./src/day7/example.txt", "utf-8");

const lines = S.split('\n');
const words = S.split(' ');

const whitespaceSurrounded = P.surroundedBy(PS.spaces)
const dollar = PC.char('$');
const changeDir = PS.string('cd');
const doubleDot = PS.string('..');
const root = PS.string('/');
const listDir = PS.string('ls');
const fileSize = pipe(PC.many1(PC.digit), P.map(x => parseInt(x, 10)));
const fileName = pipe(P.many1Till(PC.notSpace, PC.char('\n')), P.map(x => x.join('')));
const dir = PS.string('dir');
const dirName = pipe(P.many1Till(PC.notSpace, PC.char('\n')), P.map(x => x.join('')));

const output: <L, R>(l: P.Parser<string, L>, r: P.Parser<string, R>) => P.Parser<string, {left: L, right: R}> = (l, r) => pipe(
  l,
  P.bindTo('left'),
  P.chainFirst(() => PS.string(' ')),
  P.bind('right', () => r),
  P.map(({left, right}) => ({left, right}))
)



//assert(getEq(N.Eq).equals(some(10), solve(example)));
//assert(getEq(N.Eq).equals(some(29), solve(14)(example)));

//log("Solution day 7, part 1: " + pipe(solve(4)(file), getOrElse(() => -1)))();
//log("Solution day 7, part 2: " + pipe(solve(14)(file), getOrElse(() => -1)))();
