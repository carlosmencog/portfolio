import { copyFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';

const source = join(process.cwd(), 'src', 'mencolab', 'index.html');
const target = join(process.cwd(), 'dist', 'mencolab', 'index.html');

mkdirSync(dirname(target), { recursive: true });
copyFileSync(source, target);
