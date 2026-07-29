<p align="center">
  <a href="https://github.com/Celtian/ngx-i18n-extract-regex-cli">
    <img src="https://raw.githubusercontent.com/Celtian/ngx-i18n-extract-regex-cli/master/assets/logo.svg" alt="ngx-i18n-extract-regex-cli logo" width="120">
  </a>
</p>

<h1 align="center">ngx-i18n-extract-regex-cli</h1>

<p align="center">
  Extract Transloco and ngx-translate keys from Angular templates and TypeScript files.
</p>

[![npm version](https://badge.fury.io/js/ngx-i18n-extract-regex-cli.svg)](https://www.npmjs.com/package/ngx-i18n-extract-regex-cli)
[![Build & Publish](https://github.com/Celtian/ngx-i18n-extract-regex-cli/actions/workflows/main.yml/badge.svg)](https://github.com/Celtian/ngx-i18n-extract-regex-cli/actions/workflows/main.yml)
[![license](https://img.shields.io/github/license/Celtian/ngx-i18n-extract-regex-cli)](LICENSE)

## Installation

Node.js 22.12 or newer is required to run the published CLI.

Install the CLI globally:

```sh
npm install --global ngx-i18n-extract-regex-cli
```

You can also run it without a global installation:

```sh
npx ngx-i18n-extract-regex-cli --help
```

## Usage

From the root of an Angular project, run:

```sh
ngx-i18n-extract-regex-cli extract --library transloco
```

By default, the CLI:

- scans `src/app/**/*.ts` and `src/app/**/*.html`;
- reads language files matching `src/assets/i18n/*.json`;
- retains values for translation keys that already exist;
- adds missing values as `███`; and
- removes unused keys and writes the remaining keys in alphabetical order.

Use `--dry-run` to inspect the number of discovered keys without changing language files:

```sh
ngx-i18n-extract-regex-cli extract --library ngx-translate --dry-run
```

### Custom paths

Paths are resolved relative to `--cwd`. Quote glob patterns so that the CLI, rather than your shell, expands them.

```sh
ngx-i18n-extract-regex-cli extract \
  --library transloco \
  --cwd projects/example/src \
  --source 'app/**/*.ts' 'app/**/*.html' \
  --langs 'assets/i18n/*.json' \
  --default-value 'TODO'
```

### Supported expressions

The extractor recognizes common static string usages, including:

```html
{{ 'home.title' | transloco }} {{ 'home.title' | translate }}
```

```ts
transloco.translate('home.title');
translate.instant('home.title');
_('home.title');
```

Dynamic keys cannot be discovered reliably and should be added to your language files by another mechanism.

## Options

| Option            | Values                       | Default                     | Description                                           |
| ----------------- | ---------------------------- | --------------------------- | ----------------------------------------------------- |
| `--library`       | `transloco`, `ngx-translate` | `transloco`                 | Select the i18n library syntax to scan for.           |
| `--cwd`           | path                         | `src`                       | Set the base directory for source and language globs. |
| `--source`        | one or more globs            | `app/**/*.ts app/**/*.html` | Select source files to scan.                          |
| `--langs`         | one or more globs            | `assets/i18n/*.json`        | Select language JSON files to update.                 |
| `--default-value` | string                       | `███`                       | Set the value assigned to newly discovered keys.      |
| `--dry-run`       | flag                         | disabled                    | Scan without writing language files.                  |
| `--encoding`      | Node.js buffer encoding      | `utf-8`                     | Set the source and output file encoding.              |

Run `ngx-i18n-extract-regex-cli extract --help` for the complete command help.

## Development

Development uses the Node.js version declared in `.nvmrc` and the Bun version declared in `package.json`:

```sh
nvm install
nvm use
bun install
bun run lint
bun run build
bun run test:coverage
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

## License

Copyright &copy; 2024–2026 [Dominik Hladík](https://github.com/Celtian)

Licensed under the [MIT License](LICENSE).
