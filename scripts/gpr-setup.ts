/* eslint-disable @typescript-eslint/no-explicit-any */
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import distPackage from '../dist/package.json' with { type: 'json' };

// Modify package.json in dist folder
const pkg: Record<string, any> = distPackage;

pkg.publishConfig = {};
pkg.name = '@celtian/ngx-i18n-extract-regex-cli';
pkg.publishConfig.registry = 'https://npm.pkg.github.com';

writeFileSync(join(import.meta.dirname, '..', 'dist', 'package.json'), JSON.stringify(pkg, null, 2));
console.log('File package.json modified:', pkg);
