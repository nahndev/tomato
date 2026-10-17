// Validates theme/semantic.css and every theme in theme/themes:
// all tokens present, valid colors, readable contrast (semantic tones against each theme's surfaces).
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const themeDir = join(dirname(fileURLToPath(import.meta.url)), "../theme");
const dir = join(themeDir, "themes");

const ROLE_TONES = ["primary", "accent", "neutral"];
const SEMANTIC_TONES = ["success", "warning", "danger", "info"];
const TONE_STATES = ["", "-foreground", "-hover", "-active", "-focus", "-disabled", "-disabled-foreground", "-soft", "-soft-hover", "-selected", "-soft-foreground", "-border", "-border-hover", "-border-strong"];
const toneTokens = (tones) => tones.flatMap((tone) => TONE_STATES.map((state) => `${tone}${state}`));
const THEME_REQUIRED = [
  "background", "foreground", "overlay",
  "canvas", "card", "muted", "inset", "inset-hover", "muted-foreground", "border", "input",
  ...toneTokens(ROLE_TONES),
];
const SEMANTIC_REQUIRED = toneTokens(SEMANTIC_TONES);

const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

function parseModes(css) {
  const modes = { light: {}, dark: {} };
  for (const [, selector, body] of css.replace(/\/\*[\s\S]*?\*\//g, "").matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const mode = /\.dark/.test(selector) ? "dark" : "light";
    for (const [, name, value] of body.matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)) {
      modes[mode][name] = value.trim();
    }
  }
  return modes;
}

function luminance(hex) {
  const h = hex.slice(1);
  const full = h.length === 3 ? [...h].map((c) => c + c).join("") : h.slice(0, 6);
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16) / 255);
  const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const errors = [];
const warnings = [];

function validate(at, tokens, required) {
  const missing = required.filter((name) => !(name in tokens));
  if (missing.length) errors.push(`${at}: missing ${missing.join(", ")}`);
  for (const name of required) {
    if (name in tokens && !HEX.test(tokens[name])) errors.push(`${at}: --${name} must be a hex color, got "${tokens[name]}"`);
  }
}

function checkContrast(at, tokens, tones) {
  const color = (name) => (tokens[name] && HEX.test(tokens[name]) ? tokens[name] : null);
  const check = (fg, bg, min, list = errors) => {
    const [a, b] = [color(fg), color(bg)];
    if (!a || !b) return;
    const ratio = contrast(a, b);
    if (ratio < min) list.push(`${at}: --${fg} on --${bg} is ${ratio.toFixed(1)}:1 (needs ${min}:1)`);
  };

  if (tones === ROLE_TONES) {
    for (const surface of ["background", "canvas", "card", "muted", "inset", "inset-hover"]) {
      check("foreground", surface, 4.5);
      check("muted-foreground", surface, 4.5);
    }
    check("input", "background", 3);
    check("input", "card", 3);
  }

  for (const tone of tones) {
    for (const state of ["", "-hover", "-active"]) check(`${tone}-foreground`, `${tone}${state}`, 4.5);
    for (const wash of ["background", `${tone}-soft`, `${tone}-soft-hover`, `${tone}-selected`]) check(`${tone}-soft-foreground`, wash, 4.5);
    check(`${tone}-focus`, "background", 3, warnings);
  }
}

const semantic = parseModes(readFileSync(join(themeDir, "semantic.css"), "utf8"));
for (const mode of ["light", "dark"]) validate(`semantic.css [${mode}]`, semantic[mode], SEMANTIC_REQUIRED);

for (const file of readdirSync(dir).filter((f) => f.endsWith(".css") && f !== "index.css")) {
  const modes = parseModes(readFileSync(join(dir, file), "utf8"));
  for (const mode of ["light", "dark"]) {
    const at = `${file} [${mode}]`;
    validate(at, modes[mode], THEME_REQUIRED);
    checkContrast(at, modes[mode], ROLE_TONES);
    checkContrast(`${at} + semantic`, { ...semantic[mode], ...modes[mode] }, SEMANTIC_TONES);
  }
}

for (const message of warnings) console.warn(`warn  ${message}`);
for (const message of errors) console.error(`error ${message}`);
if (errors.length) process.exit(1);
console.log(`themes ok (${warnings.length} warning${warnings.length === 1 ? "" : "s"})`);
