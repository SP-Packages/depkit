import { getTools, summary } from "../utils/helper.js";
import { Printer } from "../utils/logger.js";
import { executeCommands } from "../core/executor.js";
import { Config, CommandResult, DepKitOptions } from "../types/types.js";

/**
 * Executes the DepKit tool.
 * @param config - The audio configuration.
 * @param options - The options to configure the execution.
 */
export async function depkit(config: Config, options: DepKitOptions): Promise<void> {
  Printer.log("DepKit", "header");

  const spinner = Printer.spinner("Processing...").start();

  const toolResults: CommandResult[] = [];
  const tools = getTools(config, options);

  if (Object.keys(tools).length === 0) {
    spinner.clear();
    Printer.error("No matching tools found. Skipping checks.");
    process.exit(1);
  }

  const results = await executeCommands(tools, spinner);
  spinner.clear();
  toolResults.push(...results);
  summary(toolResults);
}
