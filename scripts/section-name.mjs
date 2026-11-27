// The section-file naming rule of ADR 0005, used by scripts/sections.test.mjs.
import { basename } from "node:path";
import { template as templateOf } from "./astro-file.mjs";

/** "FoundingStory" → "founding-story", "PressFAQ" → "press-faq". */
export const kebabCase = (name) =>
  name
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();

/**
 * null when the section file at `path` renders exactly one <Section> whose `name` is a
 * string literal equal to the file name in kebab case; else what is wrong.
 */
export function sectionNameProblem(path, text) {
  const expected = kebabCase(basename(path, ".astro"));
  const template = templateOf(text);
  const tags = [...template.matchAll(/<Section(?=[\s/>])[^>]*>/g)].map((m) => m[0]);
  if (tags.length === 0) return `${path} does not render <Section name="${expected}">`;
  if (tags.length > 1) return `${path} renders ${tags.length} <Section>s; a section file renders one`;
  const name = tags[0].match(/\sname="([^"]*)"/)?.[1];
  if (name === undefined) return `${path}: <Section> needs name="${expected}" (a string literal)`;
  if (name !== expected) return `${path}: <Section name="${name}"> should be name="${expected}"`;
  return null;
}
