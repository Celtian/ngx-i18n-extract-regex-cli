#!/usr/bin/env node

import { Command } from 'commander';
import path from 'path';
import { description, version } from '../package.json';
import { I18nExtractOptions, TRANSLOCO_REGEX, i18nExtract } from '../src';

type I18nExtractCommanderOptions = Pick<
  I18nExtractOptions,
  'dryRun' | 'encoding' | 'defaultValue' | 'langs' | 'source' | 'cwd'
> & {
  library: 'transloco' | 'ngx-translate';
};

const bootstrap = (): void => {
  const program = new Command();

  program
    .name('ngx-i18n-extract-regex-cli')
    .description(description)
    .usage('<command> [options]')
    .version(version, '-v, --version', 'Output the current version.')
    .helpOption('-h, --help', 'Output usage information.');

  program
    .command('extract')
    .description('Extract translations from angular using regex')
    .requiredOption('--library <"transloco" | "ngx-translate">', 'Target i18n library', 'transloco')
    .option('--cwd <string>', 'Current working directory', 'src')
    .option('--source <string...>', 'Path to source files', ['app/**/*.ts', 'app/**/*.html'])
    .option('--langs <string...>', 'Path to language files', ['assets/i18n/*.json'])
    .option('--default-value <string>', 'Default string', '███')
    .option('--dry-run', 'Run proces without writing results', false)
    .option(
      '--encoding <"utf-8" | "ascii" | "utf8" | "utf16le" | "ucs2" | "ucs-2" | "base64" | "latin1" | "binary" | "hex">',
      'Encoding for writing results',
      'utf-8'
    )
    .action(async (options: I18nExtractCommanderOptions) => {
      await i18nExtract({
        dryRun: options.dryRun,
        encoding: options.encoding,
        defaultValue: options.defaultValue,
        cwd: path.join(process.cwd(), options.cwd),
        source: options.source,
        langs: options.langs,
        regex: TRANSLOCO_REGEX
      });
    });

  if (!process.argv.slice(2).length) {
    program.outputHelp();
  } else {
    program.parse();
  }
};

bootstrap();
