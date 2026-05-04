#!/usr/bin/env node
import { readdir, readFile, stat } from 'node:fs/promises';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const buildRoot = resolve(here, '..');
const srcRoot = join(buildRoot, 'src');

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (entry.isFile() && entry.name.endsWith('.md')) yield full;
  }
}

function parseFrontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) return { fm: {}, body: text };
  const fm = {};
  for (const line of m[1].split('\n')) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const k = line.slice(0, idx).trim();
    let v = line.slice(idx + 1).trim();
    if ((v.startsWith("'") && v.endsWith("'")) || (v.startsWith('"') && v.endsWith('"'))) v = v.slice(1, -1);
    fm[k] = v;
  }
  return { fm, body: text.slice(m[0].length) };
}

function extractPrimaryFence(body) {
  const re = /^```[a-z]+\s*\{[^}]*data-primary[^}]*\}\s*$/m;
  const start = body.match(re);
  if (!start) return null;
  const startIdx = start.index + start[0].length + 1;
  const rest = body.slice(startIdx);
  const endMatch = rest.match(/^```\s*$/m);
  if (!endMatch) return null;
  return rest.slice(0, endMatch.index).replace(/\n$/, '');
}

let failures = 0;
let matched = 0;
let warnings = 0;

for await (const file of walk(srcRoot)) {
  const text = await readFile(file, 'utf8');
  const { fm, body } = parseFrontmatter(text);
  if (!fm.sampleSource) continue;

  const primary = extractPrimaryFence(body);
  if (primary === null) {
    console.error(`✗ ${file}: declares sampleSource but has no {data-primary} fence`);
    failures++;
    continue;
  }

  const samplePath = resolve(buildRoot, fm.sampleSource);
  let sample;
  try {
    await stat(samplePath);
    sample = await readFile(samplePath, 'utf8');
  } catch {
    console.error(`✗ ${file}: sample file not found at ${samplePath}`);
    failures++;
    continue;
  }

  if (sample.startsWith('#!')) {
    sample = sample.slice(sample.indexOf('\n') + 1);
  }

  const a = Buffer.from(primary);
  const b = Buffer.from(sample.replace(/\n$/, ''));
  if (Buffer.compare(a, b) !== 0) {
    console.error(`✗ ${file}: primary fence does not match ${fm.sampleSource}`);
    console.error('--- recipe fence ---');
    console.error(primary);
    console.error('--- sample file ---');
    console.error(sample);
    failures++;
  } else {
    matched++;
  }
}

if (failures > 0) {
  console.error(`\n${failures} parity check(s) failed`);
  process.exit(1);
}
console.log(`✓ ${matched} sample(s) match their recipes${warnings ? ` (${warnings} warning(s))` : ''}`);
