import { defineConfig } from "tsup";

const shared = { format: ["cjs", "esm"], dts: true, clean: false } as const;

// The client entry is bundled apart so its "use client" banner doesn't make the whole barrel client-only.
export default defineConfig([
  { ...shared, entry: { index: "src/index.ts" } },
  { ...shared, entry: { client: "src/client.ts" }, banner: { js: '"use client";' } },
]);
