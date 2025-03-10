import { executeCommands } from "../core/executor.js";
import {
  getComposerCommandsIfAvailable,
  getNPMCommandsIfAvailable,
  summary,
} from "../utils/helper.js";
import { printHeader, printError } from "../utils/logger.js";
import { CommandResult, DepKitOptions } from "../types/types.js";

/**
 * Executes the DepKit tool.
 * @param options - The options to configure the execution.
 */
export async function depkit(options: DepKitOptions): Promise<void> {
  printHeader("DepKit");
  const { skipComposer = false, skipNpm = false, production = false } = options;

  if (skipComposer && skipNpm) {
    printError("Error: Both Composer and NPM are skipped. Exiting.");
    process.exit(1);
  }

  const toolResults: CommandResult[] = [];
  const composerCommands = skipComposer
    ? {}
    : await getComposerCommandsIfAvailable(production, toolResults);
  const npmCommands = skipNpm ? {} : await getNPMCommandsIfAvailable(production, toolResults);

  if (Object.keys(composerCommands).length === 0 && Object.keys(npmCommands).length === 0) {
    printError("Error: No valid commands to execute. Exiting.");
    process.exit(1);
  }

  const results = await executeCommands(composerCommands, npmCommands);
  toolResults.push(...results);
  summary(toolResults);
}
