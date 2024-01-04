<p align="center">
  <a href="https://github.com/Celtian/ngx-i18n-extract-regex-cli" target="blank"><img src="assets/logo.svg?sanitize=true" alt="" width="120"></a>
  <h1 align="center">NgxI18nRegexExtractCli</h1>
</p>

[![npm version](https://badge.fury.io/js/ngx-i18n-extract-regex-cli.svg)](https://badge.fury.io/js/ngx-i18n-extract-regex-cli)
[![Build & Publish](https://github.com/celtian/ngx-i18n-extract-regex-cli/workflows/Build%20&%20Publish/badge.svg)](https://github.com/celtian/ngx-i18n-extract-regex-cli/actions)

> Tool for extracting translations from Angular app using regex

## Install

_Nodejs 12 or higher need to be installed first_

```terminal
npm install -g ngx-i18n-extract-regex-cli
```

or

```terminal
yarn global  add ngx-i18n-extract-regex-cli
```

## Quick start

_Go to command line and type_

```terminal
ngx-i18n-extract-regex --help
```

## Options

| Option            | Type                                                                    | Default                        | Description                        |
| ----------------- | ----------------------------------------------------------------------- | ------------------------------ | ---------------------------------- |
| **library**       | `transloco, ngx-translate`                                              | `transloco`                    | Target i18n library                |
| **cwd**           | string                                                                  | `src`                          | Current working directory          |
| **source**        | string[]                                                                | `app/**/*.ts', 'app/**/*.html` | Path to source files               |
| **langs**         | string[]                                                                | `assets/i18n/*.json`           | Path to language files             |
| **default-value** | string                                                                  | `███`                          | Default string                     |
| **dry-run**       | boolean                                                                 | `false`                        | Run proces without writing results |
| **encoding**      | `utf-8, ascii, utf8, utf16le, ucs2, ucs-2, base64, latin1, binary, hex` | `utf-8`                        | Encoding for writing results       |

## License

Copyright &copy; 2024 [Dominik Hladik](https://github.com/Celtian)

All contents are licensed under the [MIT license].

[mit license]: LICENSE
