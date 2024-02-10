/* eslint-disable @typescript-eslint/no-explicit-any */
import { writeFileSync } from 'fs';
import { join } from 'path';
import distPackage from '../dist/package.json';

// Modify package.json in dist folder
const pkg: Record<string, any> = distPackage;

pkg.scripts = {};
pkg.devDependencies = {};
pkg.engines = {
  node: '>=12'
};

writeFileSync(join(__dirname, '..', 'dist', 'package.json'), JSON.stringify(pkg, null, 2));
console.log('File package.json modified:', pkg);
