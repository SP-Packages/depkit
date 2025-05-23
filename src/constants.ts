import { Config } from './types/types.js';

export const DEFAULT_CONFIG: Config = {
  TOOLS: {
    COMPOSER_VERSION: {
      title: 'Checking Composer version',
      command: 'info',
      args: ['--version'],
      type: 'composer',
      behavior: 'error',
      priority: 1
    },
    COMPOSER_INSTALL: {
      title: 'Installing PHP Dependencies',
      command: 'install',
      type: 'composer',
      behavior: 'error',
      priority: 2
    },
    COMPOSER_AUDIT: {
      title: 'Auditing PHP Dependencies',
      command: 'audit',
      type: 'composer',
      behavior: 'error',
      priority: 3
    },
    COMPOSER_OUTDATED: {
      title: 'Outdated PHP Dependencies',
      command: 'outdated',
      type: 'composer',
      behavior: 'warn',
      priority: 4
    },
    NPM_VERSION: {
      title: 'Checking NPM version',
      prefix: 'npm',
      command: 'info',
      args: ['--version'],
      type: 'npm',
      behavior: 'error',
      priority: 5
    },
    NPM_INSTALL: {
      title: 'Installing NPM Packages',
      command: 'install',
      type: 'npm',
      behavior: 'error',
      priority: 6
    },
    DEPCHECK: {
      title: 'Depcheck NPM Packages',
      prefix: 'npx',
      command: 'depcheck',
      type: 'npm',
      behavior: 'warn',
      requires: 'depcheck',
      priority: 7
    },
    NPM_AUDIT: {
      title: 'Auditing NPM Packages',
      command: 'audit',
      type: 'npm',
      behavior: 'error',
      priority: 8
    },
    NPM_OUTDATED: {
      title: 'Outdated NPM Packages',
      command: 'outdated',
      type: 'npm',
      behavior: 'warn',
      priority: 9
    }
  }
};
