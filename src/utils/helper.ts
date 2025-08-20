import { existsSync } from 'fs';
import { execSync } from 'child_process';
import { Printer } from '../utils/logger.js';
import {
  Commands,
  CommandResult,
  Config,
  DepKitOptions
} from '../types/types.js';

const toolCache = new Map<string, boolean>();

/**
 * Checks if the given tool is available in the system.
 * @param tool - The tool to check for
 * @param type - Optional type (e.g., "npm", "composer") to ensure the correct tool is checked
 * @returns True if the tool is available, false otherwise
 */
export function isToolAvailable(
  tool: string,
  type?: 'npm' | 'composer'
): boolean {
  const cacheKey = type ? `${type}:${tool}` : tool;
  if (toolCache.has(cacheKey)) return toolCache.get(cacheKey)!;

  const pathsToCheck: string[] = [];

  // Composer local bin
  if (!type || type === 'composer') {
    pathsToCheck.push(`vendor/bin/${tool}`);
  }

  // NPM local bin
  if (!type || type === 'npm') {
    pathsToCheck.push(`node_modules/.bin/${tool}`);
  }

  // Common system-wide paths
  pathsToCheck.push(`/usr/local/bin/${tool}`, `/usr/bin/${tool}`);

  // NPM global bin
  if (!type || type === 'npm') {
    try {
      const npmGlobalBin = execSync('npm bin -g', {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'ignore']
      }).trim();
      pathsToCheck.push(`${npmGlobalBin}/${tool}`);
    } catch {
      // ignore if npm not available
    }
  }

  // Check filesystem paths
  for (const path of pathsToCheck) {
    if (existsSync(path)) {
      toolCache.set(cacheKey, true);
      return true;
    }
  }

  const commandsToCheck = [];

  // --- NPM subcommand detection ---
  if (!type || type === 'npm') {
    try {
      const output = execSync('npm help --json', {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'ignore']
      });
      const { commands } = JSON.parse(output);
      if (commands && Object.keys(commands).includes(tool)) {
        toolCache.set(cacheKey, true);
        return true;
      }
    } catch {
      // fallback
      commandsToCheck.push(
        `npx ${tool} --no-install --version`,
        `npm ${tool} --version`
      );
    }
  }

  // --- Composer subcommand detection ---
  if (!type || type === 'composer') {
    try {
      const output = execSync('composer list --format=json', {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'ignore']
      });
      const { commands } = JSON.parse(output);
      if (
        commands.some(
          (cmd: unknown) =>
            typeof cmd === 'object' &&
            cmd !== null &&
            'name' in cmd &&
            (cmd as { name?: string }).name === tool
        )
      ) {
        toolCache.set(cacheKey, true);
        return true;
      }
    } catch {
      // fallback
      commandsToCheck.push(`composer ${tool}`);
    }
  }

  // Generic fallbacks
  commandsToCheck.push(`command -v ${tool}`, `${tool} --version`);

  for (const cmd of commandsToCheck) {
    try {
      execSync(cmd, { stdio: 'ignore' });
      toolCache.set(cacheKey, true);
      return true;
    } catch {
      continue;
    }
  }

  toolCache.set(cacheKey, false);
  return false;
}

/**
 * Sorts the tools by priority.
 * @param tools - The tools to sort
 * @returns The sorted tools
 */
function sortToolsByPriority(tools: Commands): Commands {
  // Sort tools by priority and maintain the order of files within each tool
  const sortedTools = Object.entries(tools)
    .sort(
      ([, toolA], [, toolB]) =>
        (toolA.priority ?? Number.MAX_SAFE_INTEGER) -
        (toolB.priority ?? Number.MAX_SAFE_INTEGER)
    )
    .map(([tool, lintTool]) => [tool, { ...lintTool }]);

  return Object.fromEntries(sortedTools);
}

/**
 * Gets the tools based on the configuration and options.
 * @param config - The configuration
 * @param options - The options
 * @returns The tools
 */
export function getTools(config: Config, options: DepKitOptions): Commands {
  let tools: Commands = { ...config.TOOLS };
  const { skipComposer = false, skipNpm = false, production = false } = options;

  const toolChecks = [
    { tool: 'composer', skipFlag: skipComposer, file: 'composer.json' },
    { tool: 'npm', skipFlag: skipNpm, file: 'package.json' }
  ];

  toolChecks.forEach(({ tool, skipFlag, file }) => {
    if (skipFlag || !isToolAvailable(tool) || !existsSync(file)) {
      tools = Object.fromEntries(
        Object.entries(tools).filter(([, t]) => t.type !== tool)
      );
    }
  });

  if (production) {
    tools = Object.fromEntries(
      Object.entries(tools).map(([key, tool]) => {
        const commandMap: { [key: string]: string } = {
          'npm ci': 'npm ci --omit=dev',
          'npm install': 'npm install --omit=dev',
          'composer install': 'composer install --no-dev'
        };
        return [
          key,
          { ...tool, command: commandMap[tool.command] || tool.command }
        ];
      })
    );
  }

  return sortToolsByPriority(tools);
}

/**
 * Prints the summary of the DepKit.
 * @param results - The results of the commands
 */
export function summary(results: CommandResult[]): void {
  if (Printer.isVerbose) {
    Printer.log('DepKit Results', 'subheader');
  } else {
    Printer.plainSubheader('DepKit Results');
  }

  const successes: string[] = [];
  const warnings: string[] = [];
  const errors: string[] = [];

  results.forEach(({ title, status }) => {
    if (status === 'success') {
      successes.push(`${title}: Passed`);
    } else if (status === 'warning') {
      warnings.push(`${title}: Issues found`);
    } else {
      errors.push(`${title}: Failed`);
    }
  });

  successes.forEach((success) => Printer.success(success));
  warnings.forEach((warning) => Printer.warning(warning));
  errors.forEach((error) => Printer.error(error));

  Printer.log('DepKit Summary', 'header');

  if (errors.length === 0) {
    Printer.log('DepKit completed successfully. Happy coding!', 'success');
    process.exit(0);
  } else {
    Printer.log('DepKit completed with errors.', 'error');
    process.exit(1);
  }
}
