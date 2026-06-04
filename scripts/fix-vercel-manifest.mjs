import { copyFile, mkdir, readdir } from "node:fs/promises";
import { join } from "node:path";

const sourceDir = "node_modules/.nitro/vite/services/ssr/assets";
const targetDir = ".vercel/output/functions/__server.func";
const manifestPrefix = "_tanstack-start-manifest_";

const files = await readdir(sourceDir);
const manifest = files.find((file) => file.startsWith(manifestPrefix) && file.endsWith(".js"));

if (!manifest) {
  throw new Error(`Could not find ${manifestPrefix}*.js in ${sourceDir}`);
}

await mkdir(targetDir, { recursive: true });
await copyFile(join(sourceDir, manifest), join(targetDir, manifest.replace(/\.js$/, ".mjs")));

console.log(`Copied ${manifest} into the Vercel function bundle.`);
