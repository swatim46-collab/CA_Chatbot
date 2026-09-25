import { gzipSync } from 'node:zlib';
import { readdir, readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';

const DIST_DIRECTORY = 'dist';
const MAX_GZIP_BYTES = 300_000;
const COMPRESSIBLE_EXTENSIONS = new Set(['.html', '.js', '.css', '.svg']);

async function collectAssets(directory) {
  const entries = await readdir(directory);
  const assets = [];

  for (const entry of entries) {
    const path = join(directory, entry);
    const entryStat = await stat(path);
    if (entryStat.isDirectory()) {
      assets.push(...await collectAssets(path));
    } else if (COMPRESSIBLE_EXTENSIONS.has(path.slice(path.lastIndexOf('.')))) {
      assets.push(path);
    }
  }

  return assets;
}

try {
  const assets = await collectAssets(DIST_DIRECTORY);
  const results = await Promise.all(assets.map(async (path) => {
    const contents = await readFile(path);
    return { path, gzipBytes: gzipSync(contents, { level: 9 }).byteLength };
  }));
  const totalBytes = results.reduce((total, asset) => total + asset.gzipBytes, 0);

  for (const asset of results) {
    console.log(`${asset.path}: ${asset.gzipBytes.toLocaleString()} gzip bytes`);
  }
  console.log(`Total: ${totalBytes.toLocaleString()} / ${MAX_GZIP_BYTES.toLocaleString()} gzip bytes`);

  if (totalBytes > MAX_GZIP_BYTES) {
    console.error('The production assets exceed the 300 KB gzip budget.');
    process.exitCode = 1;
  }
} catch {
  console.error('Could not measure the production bundle. Run the production build first.');
  process.exitCode = 1;
}
