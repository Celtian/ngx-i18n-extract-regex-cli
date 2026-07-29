/* eslint-disable @typescript-eslint/no-explicit-any */
import { copyFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import distPackage from '../dist/package.json' with { type: 'json' };

const projectRoot = join(import.meta.dirname, '..');
const distDirectory = join(projectRoot, 'dist');

copyFileSync(join(projectRoot, 'README.md'), join(distDirectory, 'README.md'));
copyFileSync(join(projectRoot, 'LICENSE'), join(distDirectory, 'LICENSE'));

// Modify package.json in dist folder
const pkg: Record<string, any> = distPackage;

pkg.scripts = {};
pkg.devDependencies = {};
delete pkg.packageManager;
pkg.engines = {
  node: '>=22.12.0'
};

writeFileSync(join(distDirectory, 'package.json'), JSON.stringify(pkg, null, 2));
console.log('File package.json modified:', pkg);
