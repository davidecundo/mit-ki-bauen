#!/usr/bin/env node
/**
 * Content guards for a static site repo. No dependencies, Node 18+.
 *
 * Three checks, all driven by a JSON config (default: content-guards.json):
 *   1. sharp-s:      no sharp s (U+00DF) in any text file (Swiss spelling uses "ss").
 *   2. forbidden:    no word from `forbiddenWords` in any text file (case-insensitive).
 *   3. placeholders: no placeholder string from `placeholderPatterns` in the build output.
 *
 * Binary files (fonts, images, archives, ...) are skipped by extension and by a NUL-byte sniff.
 *
 * Usage:
 *   node scripts/check-content.mjs                      # uses ./content-guards.json
 *   node scripts/check-content.mjs --config path.json
 *   node scripts/check-content.mjs --require-build      # fail if the build dir is missing
 *
 * Exit code 0 = all good, 1 = at least one finding, 2 = bad config.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, resolve, extname, sep, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const argValue = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
const configPath = resolve(argValue('--config') ?? 'content-guards.json');
const requireBuild = args.includes('--require-build');

let config;
try {
  config = JSON.parse(readFileSync(configPath, 'utf8'));
} catch (err) {
  console.error(`Cannot read config ${configPath}: ${err.message}`);
  process.exit(2);
}

// `root` is relative to the config file, so the check works from any working directory.
const root = resolve(dirname(configPath), config.root ?? '.');
const buildDir = resolve(root, config.buildDir ?? 'dist');
const ignoreDirs = new Set(config.ignoreDirs ?? ['.git', 'node_modules', '.astro']);
const ignoreFiles = new Set((config.ignoreFiles ?? []).map((f) => resolve(root, f)));
ignoreFiles.add(configPath); // the config lists the forbidden words itself
ignoreFiles.add(fileURLToPath(import.meta.url)); // and this script
const forbiddenWords = config.forbiddenWords ?? [];
const placeholderPatterns = config.placeholderPatterns ?? [];
const allowPatterns = (config.allowPatterns ?? []).map((p) => new RegExp(p, 'gi'));

const BINARY_EXT = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif', '.ico', '.bmp', '.tiff',
  '.woff', '.woff2', '.ttf', '.otf', '.eot',
  '.pdf', '.zip', '.gz', '.tgz', '.br', '.zst', '.7z', '.rar',
  '.mp3', '.mp4', '.mov', '.webm', '.wav', '.ogg',
  '.wasm', '.exe', '.dll', '.so', '.dylib', '.bin',
]);

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!ignoreDirs.has(entry.name)) yield* walk(full);
    } else if (entry.isFile()) {
      yield full;
    }
  }
}

function readText(file) {
  if (ignoreFiles.has(file) || BINARY_EXT.has(extname(file).toLowerCase())) return null;
  const buf = readFileSync(file);
  if (buf.subarray(0, 8000).includes(0)) return null; // NUL byte: treat as binary
  return buf.toString('utf8');
}

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const findings = [];
const report = (check, file, text, index, match) => {
  const line = text.slice(0, index).split('\n').length;
  findings.push(`${check}: ${relative(root, file).split(sep).join('/')}:${line}: "${match}"`);
};

const SHARP_S = /\u00DF/g;
const forbiddenRe = forbiddenWords.length
  ? new RegExp(forbiddenWords.map(escapeRe).join('|'), 'gi')
  : null;
const placeholderRe = placeholderPatterns.length
  ? new RegExp(placeholderPatterns.map(escapeRe).join('|'), 'gi')
  : null;

// Checks 1 and 2: every text file in the repo, including the build output if present.
for (const file of walk(root)) {
  const raw = readText(file);
  if (raw === null) continue;
  for (const m of raw.matchAll(SHARP_S)) report('sharp-s', file, raw, m.index, m[0]);
  if (forbiddenRe) {
    // Allowed exceptions (e.g. one specific link) are blanked out before matching.
    let text = raw;
    for (const allow of allowPatterns) text = text.replace(allow, (s) => ' '.repeat(s.length));
    for (const m of text.matchAll(forbiddenRe)) report('forbidden', file, raw, m.index, m[0]);
  }
}

// Check 3: placeholders only matter in what visitors get, so only the build output is scanned.
if (placeholderRe) {
  if (existsSync(buildDir) && statSync(buildDir).isDirectory()) {
    for (const file of walk(buildDir)) {
      const text = readText(file);
      if (text === null) continue;
      for (const m of text.matchAll(placeholderRe)) report('placeholder', file, text, m.index, m[0]);
    }
  } else if (requireBuild) {
    findings.push(`placeholder: build dir ${relative(root, buildDir) || '.'} not found (run the build first)`);
  } else {
    console.log(`Note: build dir ${relative(root, buildDir) || '.'} not found, placeholder check skipped.`);
  }
}

if (findings.length) {
  console.error(`Content guards failed (${findings.length}):`);
  for (const f of findings) console.error(`  ${f}`);
  console.error('\nFix: use "ss" instead of the sharp s, remove forbidden words, replace placeholders with approved text.');
  process.exit(1);
}
console.log('Content guards passed: no sharp s, no forbidden words, no placeholders in the build output.');
