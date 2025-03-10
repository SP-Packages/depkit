import { existsSync } from "fs";
import { execSync } from "child_process";
import { Commands, CommandResult } from "../types/types.js";
import { COMPOSER_COMMANDS, NPM_COMMANDS } from "../constants.js";
import {
  printSuccess,
  printWarning,
  printError,
  printHeader,
  printSubheader,
} from "../utils/logger.js";

/**
 * Checks if the given tool is available in the system.
 * @param tool - The tool to check for
 * @returns True if the tool is available, false otherwise
 */
export function isToolAvailable(tool: string): boolean {
  const commandsToCheck = [
    `npx ${tool} --no-install --version`,
    `command -v ${tool}`,
    `${tool} --version`,
  ];

  for (const cmd of commandsToCheck) {
    try {
      execSync(cmd, { stdio: "ignore" });
      return true;
    } catch {
      continue;
    }
  }

  return false;
}

/**
 * Gets the Composer commands.
 * @param production - If the production flag is set
 * @returns The Composer commands
 */
export function getComposerCommands(production: boolean): Commands {
  const commands = { ...COMPOSER_COMMANDS };

  if (production) {
    commands.install = {
      title: "Installing PHP Dependencies (Production Only)",
      command: "composer install --no-dev",
      behavior: "error",
    };
  }

  return commands;
}

/**
 * Gets the NPM commands.
 * @param production - If the production flag is set
 * @returns The NPM commands
 */
export function getNPMCommands(production: boolean): Commands {
  const commands = { ...NPM_COMMANDS };

  if (production) {
    commands.install = {
      title: "Installing NPM Dependencies (Production Only)",
      command: "npm install --omit=dev",
      behavior: "error",
    };
  }

  return commands;
}

/**
 * Gets the Composer commands if available.
 * @param production - If the production flag is set
 * @param toolResults - The results of the tool
 * @returns The Composer commands
 */
export async function getComposerCommandsIfAvailable(
  production: boolean,
  toolResults: CommandResult[],
): Promise<Commands> {
  if (!isToolAvailable("composer")) {
    printError("Error: Composer is not installed. Skipping Composer commands.");
    toolResults.push({
      title: "Composer Manager",
      status: "error",
      output: "Composer is not installed.",
    });
    return {};
  }

  if (!existsSync("composer.json")) {
    printError("Error: No composer.json found. Skipping Composer commands.");
    toolResults.push({
      title: "Composer Manager",
      status: "error",
      output: "composer.json not found.",
    });
    return {};
  }

  return getComposerCommands(production);
}

/**
 * Gets the NPM commands if available.
 * @param production - If the production flag is set
 * @param toolResults - The results of the tool
 * @returns The NPM commands
 */
export async function getNPMCommandsIfAvailable(
  production: boolean,
  toolResults: CommandResult[],
): Promise<Commands> {
  if (!isToolAvailable("npm")) {
    printError("Error: NPM is not installed. Skipping NPM commands.");
    toolResults.push({
      title: "NPM Manager",
      status: "error",
      output: "NPM is not installed.",
    });
    return {};
  }

  if (!existsSync("package.json")) {
    printError("Error: No package.json found. Skipping NPM commands.");
    toolResults.push({
      title: "NPM Manager",
      status: "error",
      output: "package.json not found.",
    });
    return {};
  }

  return getNPMCommands(production);
}

/**
 * Prints the summary of the DepKit.
 * @param results - The results of the commands
 */
export function summary(results: CommandResult[]): void {
  printSubheader("DepKit Results");
  let overAllStatus = true;
  results.forEach(({ title, status, output }) => {
    if (status === "success") {
      printSuccess(`${title}: Passed`);
    } else if (status === "warning") {
      printWarning(`${title}: Issues found - ${output}`);
    } else {
      printError(`${title}: Failed - ${output}`);
      overAllStatus = false;
    }
  });

  printHeader("DepKit Summary");
  if (overAllStatus) {
    printSuccess("DepKit completed successfully. Happy coding!");
    process.exit(0);
  } else {
    printError("DepKit completed with errors.");
    process.exit(1);
  }
}
