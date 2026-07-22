import { copyFileSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';

const sourceRoot = join(process.cwd(), 'src', 'mencolab');
const targetRoot = join(process.cwd(), 'dist', 'mencolab');

function copyHtmlPages(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const source = join(directory, entry.name);

    if (entry.isDirectory()) {
      copyHtmlPages(source);
      continue;
    }

    if (entry.name !== 'index.html') {
      continue;
    }

    const target = join(targetRoot, relative(sourceRoot, source));
    mkdirSync(dirname(target), { recursive: true });
    copyFileSync(source, target);
  }
}

copyHtmlPages(sourceRoot);
