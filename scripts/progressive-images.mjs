import { dirname } from 'node:path';
import { readFile } from 'node:fs/promises';
import sharp from 'sharp';

const prefix = '\0progressive-image:';

// Import any local photo with ?progressive to get its URL, dimensions, and
// an embedded tiny preview. Works in Vite development and production builds.
export default function progressiveImages() {
  return {
    name: 'progressive-images',
    enforce: 'pre',
    async resolveId(source, importer) {
      if (!source.endsWith('?progressive')) return;
      const resolved = await this.resolve(source.slice(0, -12), importer, { skipSelf: true });
      if (!resolved) throw new Error(`Unable to resolve photo from ${dirname(importer || '')}`);
      return `${prefix}${encodeURIComponent(resolved.id.split('?')[0])}.js`;
    },
    async load(id) {
      if (!id.startsWith(prefix)) return;
      const file = decodeURIComponent(id.slice(prefix.length, -3));
      this.addWatchFile(file);
      const source = await readFile(file);
      const metadata = await sharp(source).metadata();
      const preview = await sharp(source).rotate().resize({ width: 20, height: 20, fit: 'inside', withoutEnlargement: true }).webp({ quality: 35 }).toBuffer();
      const rotated = [5, 6, 7, 8].includes(metadata.orientation);
      return `import src from ${JSON.stringify(`${file}?url`)};
export default { src, placeholder: ${JSON.stringify(`data:image/webp;base64,${preview.toString('base64')}`)}, width: ${rotated ? metadata.height : metadata.width}, height: ${rotated ? metadata.width : metadata.height} };`;
    },
  };
}
