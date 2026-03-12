// Run with: node setup-dirs.mjs
import { mkdirSync } from "node:fs";

const dirs = [
  "scripts",
  "backend/src/modules/builder/base-components",
  "backend/src/modules/builder/modifiers",
];

for (const dir of dirs) {
  mkdirSync(dir, { recursive: true });
  console.log(`✓ Created ${dir}`);
}

console.log("\nDone! You can delete this file now.");
