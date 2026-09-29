import { Module } from "./types";
import { mhudi } from "./mhudi";
import { ityalaLamawele } from "./ityala-lamawele";
import { indaba } from "./indaba";
import { vilakazi } from "./vilakazi";
import { unsungHeroes } from "./unsung-heroes";
import { marriageRites } from "./marriage-rites";
import { peoplingOfSa } from "./peopling-of-sa";
import { peoplesCultures } from "./peoples-cultures";
import { traditions } from "./traditions";
import { food } from "./food";
import { biko } from "./biko";
import { winnie } from "./winnie";
import { mandela } from "./mandela";

// The four literary pillars.
export const modules: Module[] = [mhudi, ityalaLamawele, indaba, vilakazi];

// The Cultural Atlas — grounded, cited heritage entries (history, customs, heroes, peoples).
export const atlasModules: Module[] = [
  peoplingOfSa,
  peoplesCultures,
  traditions,
  marriageRites,
  food,
  unsungHeroes,
  // Single lives, told as books (SP-118–120). Opened from the hero's or president's page as well as the Atlas.
  biko,
  winnie,
  mandela,
];

// Everything — for reader lookup and source crediting on the About screen.
export const allModules: Module[] = [...modules, ...atlasModules];

export const moduleById = (id: string) => allModules.find((m) => m.id === id);

export * from "./types";
