// Export a Vite build as one HTML file that can be opened offline.
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
const root = resolve(import.meta.dirname, '..');
const [buildDirectory = 'dist', outputFile = 'standalone.html'] = process.argv.slice(2);
let html = await readFile(resolve(root, buildDirectory, 'index.html'), 'utf8');
const script = html.match(/<script[^>]+src="([^"]+)"[^>]*><\/script>/);
const stylesheet = html.match(/<link[^>]+href="([^"]+\.css)"[^>]*>/);
if (!script || !stylesheet) throw new Error('Build assets were not found. Run npm run build first.');
const asset = (url) => resolve(root, buildDirectory, url.replace(/^\//, ''));
let js = await readFile(asset(script[1]), 'utf8');
const imageTypes = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.gif': 'image/gif' };
for (const file of await readdir(resolve(root, buildDirectory, 'assets'))) {
  const extension = file.slice(file.lastIndexOf('.')).toLowerCase();
  if (!imageTypes[extension]) continue;
  const bytes = await readFile(resolve(root, buildDirectory, 'assets', file));
  js = js.replaceAll(`/assets/${file}`, `data:${imageTypes[extension]};base64,${bytes.toString('base64')}`);
}
let css = await readFile(asset(stylesheet[1]), 'utf8');
const font = await readFile(resolve(root, 'public/fonts/inter-latin-wght-normal.woff2'));
css = css.replace(/url\([^)]*inter-latin-wght-normal\.woff2[^)]*\)/g, `url(data:font/woff2;base64,${font.toString('base64')})`);
html = html.replace(script[0], () => `<script type="module">${js.replace(/<\/script/gi, '<\\/script')}</script>`);
html = html.replace(stylesheet[0], () => `<style>${css}</style>`);
const favicon = await readFile(resolve(root, 'public/favicon.svg'), 'utf8');
html = html.replace('href="/favicon.svg"', `href="data:image/svg+xml,${encodeURIComponent(favicon)}"`);
html = html.replace(/[ \t]+$/gm, '');
await writeFile(resolve(root, outputFile), html);
console.log(`Created ${outputFile} — self-contained preview, no server required.`);
