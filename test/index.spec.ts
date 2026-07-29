import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NGX_TRANSLATE_REGEX, TRANSLOCO_REGEX, i18nExtract, type I18nExtractOptions } from '../src/index.js';

const writeFixture = async (cwd: string, relativePath: string, content: string): Promise<void> => {
  const target = path.join(cwd, relativePath);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, content, 'utf8');
};

const readFixture = (cwd: string, relativePath: string): Promise<string> =>
  readFile(path.join(cwd, relativePath), 'utf8');

const options = (
  cwd: string,
  regex: I18nExtractOptions['regex'],
  overrides: Partial<I18nExtractOptions> = {}
): I18nExtractOptions => ({
  cwd,
  defaultValue: 'TODO',
  dryRun: false,
  encoding: 'utf8',
  langs: 'i18n/*.json',
  regex,
  source: ['app/**/*.html', 'app/**/*.ts'],
  ...overrides
});

describe('i18nExtract', () => {
  let cwd: string;

  beforeEach(async () => {
    cwd = await mkdtemp(path.join(tmpdir(), 'ngx-i18n-extract-'));
    vi.spyOn(console, 'log').mockImplementation(() => undefined);
    vi.spyOn(console, 'table').mockImplementation(() => undefined);
  });

  afterEach(async () => {
    vi.restoreAllMocks();
    await rm(cwd, { recursive: true, force: true });
  });

  it('extracts, sorts, and nests keys while preserving existing language values', async () => {
    await writeFixture(
      cwd,
      'app/component.ts',
      `
        _('z.last');
        transloco.translate("account.greeting");
        transloco.translate('empty.value');
      `
    );
    await writeFixture(cwd, 'app/component.html', `{{ 'home.title' | transloco }}`);
    await writeFixture(cwd, 'app/ignored.txt', `_('ignored.key')`);
    await writeFixture(
      cwd,
      'i18n/en.json',
      JSON.stringify({
        unused: 'remove me',
        z: { last: 'Existing value' },
        empty: { value: '' }
      })
    );
    await writeFixture(cwd, 'i18n/cs.json', JSON.stringify({ home: { title: 'Domů' } }));

    await i18nExtract(
      options(cwd, TRANSLOCO_REGEX, {
        source: 'app/**/*'
      })
    );

    expect(await readFixture(cwd, 'i18n/en.json')).toBe(
      JSON.stringify(
        {
          account: { greeting: 'TODO' },
          empty: { value: '' },
          home: { title: 'TODO' },
          z: { last: 'Existing value' }
        },
        null,
        2
      )
    );
    expect(JSON.parse(await readFixture(cwd, 'i18n/cs.json'))).toEqual({
      account: { greeting: 'TODO' },
      empty: { value: 'TODO' },
      home: { title: 'Domů' },
      z: { last: 'TODO' }
    });
  });

  it('supports every documented regex example', async () => {
    const libraries = [
      ['Transloco', TRANSLOCO_REGEX],
      ['ngx-translate', NGX_TRANSLATE_REGEX]
    ] as const;

    for (const [library, regex] of libraries) {
      for (const [extension, parsers] of [
        ['html', regex.html],
        ['ts', regex.typescript]
      ] as const) {
        for (const parser of parsers) {
          for (const coveredCase of parser.coveredCases) {
            await writeFixture(cwd, `app/case.${extension}`, coveredCase);
            await writeFixture(cwd, 'i18n/en.json', '{}');

            await i18nExtract(
              options(cwd, regex, {
                source: `app/case.${extension}`
              })
            );

            expect(JSON.parse(await readFixture(cwd, 'i18n/en.json')), `${library}: ${coveredCase}`).toEqual({
              uni: { close: 'TODO' }
            });
          }
        }
      }
    }
  });

  it('does not change language files during a dry run', async () => {
    await writeFixture(cwd, 'app/component.ts', `translate.instant('new.key')`);
    await writeFixture(cwd, 'i18n/en.json', `{"existing":"value"}`);

    await i18nExtract(
      options(cwd, NGX_TRANSLATE_REGEX, {
        dryRun: true
      })
    );

    expect(await readFixture(cwd, 'i18n/en.json')).toBe(`{"existing":"value"}`);
    expect(console.log).toHaveBeenCalledWith('ℹ Dry run activated. Language files will not be updated.');
  });

  it('rejects when a language file contains invalid JSON', async () => {
    await writeFixture(cwd, 'app/component.ts', `_('new.key')`);
    await writeFixture(cwd, 'i18n/en.json', '{invalid');

    await expect(i18nExtract(options(cwd, TRANSLOCO_REGEX))).rejects.toThrow();
  });
});
