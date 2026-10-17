// Usage: node scripts/generate-theme.mjs <name> <hex> <hex> <hex> [<hex>] [<hex>] [primary=#hex ...]
// Picks primary / accent / neutral from a 3-5 color palette, generates the 14 states
// for light + dark, writes theme/themes/<name>.css and registers it. The Fixed group is copied from twilight.
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const themesDir = join(root, "theme/themes");
const constantsFile = join(root, "../constants/src/theme.constants.ts");
const ROLES = ["primary", "accent", "neutral"];
const FIXED = ["background", "foreground", "overlay"];

const srgb = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);

function toOklch(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => lin(parseInt(hex.slice(i, i + 2), 16) / 255));
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return { l: 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, c: Math.hypot(a, bb), h: (Math.atan2(bb, a) * 180) / Math.PI };
}

function rgbOf({ l, c, h }) {
  const a = c * Math.cos((h * Math.PI) / 180);
  const b = c * Math.sin((h * Math.PI) / 180);
  const L = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const M = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const S = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * L - 3.3077115913 * M + 0.2309699292 * S,
    -1.2684380046 * L + 2.6097574011 * M - 0.3413193965 * S,
    -0.0041960863 * L - 0.7034186147 * M + 1.707614701 * S,
  ];
}

// Reduce chroma until the color fits in sRGB
function toHex({ l, c, h }) {
  let lo = 0;
  let hi = c;
  const fits = (k) => rgbOf({ l, c: k, h }).every((v) => v >= -0.0005 && v <= 1.0005);
  if (!fits(c)) {
    for (let i = 0; i < 20; i++) {
      const mid = (lo + hi) / 2;
      if (fits(mid)) lo = mid;
      else hi = mid;
    }
    c = lo;
  }
  return `#${rgbOf({ l, c, h }).map((v) => Math.round(Math.min(1, Math.max(0, srgb(v))) * 255).toString(16).padStart(2, "0")).join("")}`;
}

function luminance(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => lin(parseInt(hex.slice(i, i + 2), 16) / 255));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const at = (base, l, k) => toHex({ l, c: base.c * k, h: base.h });
const shift = (hex, dl, k) => {
  const o = toOklch(hex);
  return toHex({ l: o.l + dl, c: o.c * k, h: o.h });
};

function pickRoles(colors) {
  const items = colors.map((hex) => ({ hex, ...toOklch(hex) }));
  const neutral = items.reduce((a, b) => (b.c < a.c ? b : a));
  const [primary, ...rest] = items.filter((x) => x !== neutral); // palette order: first = primary
  const hueGap = (x) => Math.abs(((x.h - primary.h + 540) % 360) - 180);
  const accent = rest.reduce((a, b) => (hueGap(b) > hueGap(a) ? b : a));
  return { primary, accent, neutral };
}

function lightTone(role, fg, neutralText) {
  const base = toOklch(role);
  let l = Math.min(base.l, 0.55);
  while (l > 0.2 && contrast("#ffffff", toHex({ ...base, l })) < 4.6) l -= 0.01;
  const solid = toHex({ ...base, l });
  const border = at(base, 0.75, 0.45);
  const outline = neutralText ? at(base, 0.65, 1) : border;
  return {
    "": solid,
    "-foreground": "#ffffff",
    "-hover": at(base, l - 0.03, 0.9),
    "-active": at(base, l - 0.06, 0.8),
    "-focus": solid,
    "-disabled": at(base, 0.9, 0.18),
    "-disabled-foreground": border,
    "-soft": at(base, 0.945, 0.1),
    "-soft-hover": at(base, 0.915, 0.16),
    "-selected": at(base, 0.87, 0.24),
    "-soft-foreground": neutralText ?? toHex({ ...base, l: Math.min(l, 0.45) }),
    "-border": outline,
    "-border-hover": shift(outline, -0.08, 1.15),
    "-border-strong": shift(outline, -0.2, 1.3),
  };
}

function darkTone(role, fg, neutralText) {
  const base = toOklch(role);
  const l = clamp(base.l, 0.7, 0.78);
  const border = at(base, 0.42, 0.5);
  const outline = neutralText ? at(base, 0.55, 1) : border;
  return {
    "": at(base, l, 0.9),
    "-foreground": fg,
    "-hover": at(base, l + 0.03, 0.87),
    "-active": at(base, l + 0.06, 0.76),
    "-focus": at(base, l, 0.9),
    "-disabled": at(base, 0.27, 0.25),
    "-disabled-foreground": border,
    "-soft": at(base, 0.23, 0.2),
    "-soft-hover": at(base, 0.26, 0.28),
    "-selected": at(base, 0.3, 0.36),
    "-soft-foreground": neutralText ?? at(base, 0.8, 0.7),
    "-border": outline,
    "-border-hover": shift(outline, 0.08, 1.1),
    "-border-strong": shift(outline, 0.2, 1.15),
  };
}

const LADDER = {
  light: { canvas: [0.98, 0.011], muted: [0.96, 0.018], inset: [0.94, 0.022], "inset-hover": [0.91, 0.027], "muted-foreground": [0.47, 0.04], border: [0.89, 0.023], input: [0.65, 0.04] },
  dark: { canvas: [0.14, 0.018], card: [0.21, 0.025], muted: [0.25, 0.03], inset: [0.28, 0.032], "inset-hover": [0.32, 0.035], "muted-foreground": [0.72, 0.039], border: [0.34, 0.035], input: [0.55, 0.04] },
};

function ladder(mode, neutral, fixed) {
  const k = Math.min(1, neutral.c / 0.03);
  const out = {};
  for (const [name, [l, c]] of Object.entries(LADDER[mode])) out[name] = toHex({ l, c: c * k, h: neutral.h });
  if (mode === "light") out.card = fixed.background;
  return out;
}

const lines = (title, tokens, prefix = "") => [`  /* ${title} */`, ...Object.entries(tokens).map(([k, v]) => `  --${prefix}${k}: ${v};`)];

function block(mode, roles, fixed) {
  const neutral = roles.neutral;
  const make = mode === "light" ? lightTone : darkTone;
  const order = ["canvas", "card", "muted", "inset", "inset-hover", "muted-foreground", "border", "input"];
  const lad = ladder(mode, neutral, fixed);
  const out = [...lines("Fixed", fixed), "", ...lines("Neutral ladder: back to front", Object.fromEntries(order.map((k) => [k, lad[k]])))];
  for (const role of ROLES) {
    const tone = make(roles[role].hex, fixed.background, role === "neutral" ? fixed.foreground : undefined);
    out.push("", ...lines(`Role: ${role}`, Object.fromEntries(Object.entries(tone).map(([s, v]) => [role + s, v]))));
  }
  return out;
}

function readFixed() {
  const css = readFileSync(join(themesDir, "twilight.css"), "utf8");
  const [light, dark] = css.split(/\[data-theme="twilight"\]\.dark/);
  const pick = (src) => Object.fromEntries(FIXED.map((k) => [k, src.match(new RegExp(`--${k}:\\s*(#\\w+)`))[1]]));
  return { light: pick(light), dark: pick(dark) };
}

function main() {
  const [name, ...rest] = process.argv.slice(2);
  const overrides = Object.fromEntries(rest.filter((a) => a.includes("=")).map((a) => a.split("=")));
  const colors = rest.filter((a) => !a.includes("=")).map((c) => (c.startsWith("#") ? c : `#${c}`).toLowerCase());
  if (!/^[a-z][a-z0-9-]*$/.test(name ?? "") || colors.length < 3 || colors.length > 5 || !colors.every((c) => /^#[0-9a-f]{6}$/.test(c))) {
    console.error("usage: generate-theme.mjs <kebab-name> <hex> <hex> <hex> [<hex>] [<hex>] [primary=#hex ...]");
    process.exit(1);
  }
  const roles = pickRoles(colors);
  for (const role of ROLES) if (overrides[role]) roles[role] = { hex: overrides[role], ...toOklch(overrides[role]) };
  const fixed = readFixed();
  const defaultKey = readFileSync(constantsFile, "utf8").match(/DEFAULT_THEME: Theme = Theme\.(\w+)/)?.[1];
  const isDefault = defaultKey === name.toUpperCase().replace(/-/g, "_");

  const css = [
    ...(isDefault ? ["/* Default theme; `:where(...)` keeps it overridable by any other theme */", ":where(:root),"] : []),
    `[data-theme="${name}"] {`,
    ...block("light", roles, fixed.light),
    "}",
    "",
    `${isDefault ? ":where(:root.dark),\n" : ""}[data-theme="${name}"].dark,\n.dark [data-theme="${name}"] {`,
    ...block("dark", roles, fixed.dark),
    "}",
    "",
  ].join("\n");
  writeFileSync(join(themesDir, `${name}.css`), css);

  const indexFile = join(themesDir, "index.css");
  const index = readFileSync(indexFile, "utf8");
  const importLine = `@import "./${name}.css";`;
  if (!index.includes(importLine)) writeFileSync(indexFile, `${index.trimEnd()}\n${importLine}\n`);

  const key = name.toUpperCase().replace(/-/g, "_");
  const constants = readFileSync(constantsFile, "utf8");
  if (!constants.includes(`'${name}'`)) writeFileSync(constantsFile, constants.replace("} as const;", `  ${key}: '${name}',\n} as const;`));

  for (const role of ROLES) console.log(`${role.padEnd(9)} ${roles[role].hex}`);
  try {
    execFileSync("node", [join(root, "scripts/check-themes.mjs")], { stdio: "inherit" });
  } catch {
    process.exit(1);
  }
}

main();
