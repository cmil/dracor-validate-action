import { relative } from 'path';
import * as core from '@actions/core';
import glob from '@actions/glob';
import { DRACOR_VERSION, TEI_VERSION } from './config.js';

export interface Params {
  schema: string;
  version: string;
  files: string;
  warnOnly: boolean;
}

export function trimFilePath(path: string) {
  return relative(process.cwd(), path);
}

export function defaultVersion(schema: string): string {
  if (schema === 'dracor') {
    return DRACOR_VERSION;
  }
  return TEI_VERSION;
}

export async function resolveFiles(files: string) {
  let paths = [];
  if (files.match(/\*/)) {
    const globber = await glob.create(files.split(/\s+/).join('\n'));
    paths = (await globber.glob()).map((p) => trimFilePath(p));
  } else {
    paths = files.split(/\s+/);
  }
  return paths.filter((p) => p !== '');
}

export function getParams(): Params {
  const schema = core.getInput('schema') || 'tei';
  const version = core.getInput('version') || defaultVersion(schema);
  const files = core.getInput('files') || '';
  const warnOnly = /^(yes|true)$/i.test(core.getInput('warn-only'));
  return { schema, version, files, warnOnly };
}

export function makeUrl(filePath: string, line: number): string {
  if (process.env.GITHUB_REPOSITORY) {
    const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');
    const sha = process.env.GITHUB_SHA;
    const url = `https://github.com/${owner}/${repo}/blob/${sha}/${filePath}#L${line}`;
    return url;
  }
  return '';
}

export function makeLink(
  filePath: string,
  line: number,
  text?: string
): string {
  const linkText = text || filePath;
  const url = makeUrl(filePath, line);
  if (url) {
    return `<a href="${url}">${linkText}</a>`;
  }
  return linkText;
}

export function truncateJingMessage(message: string): string {
  return message.split('; ')[0];
}
