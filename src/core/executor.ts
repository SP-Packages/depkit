import { promisify } from "util";
import { exec } from "child_process";
import { isToolAvailable } from "../utils/helper.js";
import { Commands, CommandResult, StdError } from "../types/types.js";
import {
  printSubheader,
  printSectionHeader,
  printSuccess,
  printWarning,
  printError,
} from "../utils/logger.js";

const results: CommandResult[] = [];
const execPromise = promisify(exec);

/**
 * Executes the commands in the given list.
 * @param commands - The list of commands to execute
 * @returns The results of the command execution
 */
async function runCommands(commands: Commands): Promise<void> {
  for (const key of Object.keys(commands)) {
    const { title, command, behavior, requires } = commands[key];
    printSectionHeader(title);

    if (requires && !isToolAvailable(requires)) {
      if (behavior === "warn") {
        printWarning(`Skipping ${title}: Required tool '${requires}' not found.`);
        results.push({ title, status: "warning", output: `Missing tool: ${requires}` });
      } else {
        printError(`Skipping ${title}: Required tool '${requires}' not found.`);
        results.push({ title, status: "error", output: `Missing tool: ${requires}` });
      }
      continue;
    }

    try {
      const { stdout, stderr } = await execPromise(command);
      const output = stdout.trim() || "Success";
      printSuccess(output);
      if (stderr) printWarning(stderr.trim());
      results.push({ title, status: "success", output });
    } catch (e: unknown) {
      if (e as string) {
        const { stdout, stderr, message } = e as StdError;
        const out = stdout.trim();
        const err = stderr.trim();
        const msg = message.trim();

        if (stdout) printError(out);
        if (stderr) printError(err);

        if (behavior === "warn") {
          printWarning(`Warning: ${msg}`);
          results.push({ title, status: "warning", output: msg });
        } else {
          printError(`Error: ${msg}`);
          results.push({ title, status: "error", output: msg });
        }
      } else {
        results.push({ title, status: "error", output: "Unknown error occurred." });
        throw new Error("Error: Unknown error occurred.");
      }
    }
  }
}

/**
 * Executes the given commands.
 * @param composerCommands - The Composer commands to execute
 * @param npmCommands - The NPM commands to execute
 * @returns The results of the command execution
 */
export async function executeCommands(
  composerCommands: Commands,
  npmCommands: Commands,
): Promise<CommandResult[]> {
  try {
    if (Object.keys(composerCommands).length > 0) {
      printSubheader("Composer Manager");
      await runCommands(composerCommands);
    }

    if (Object.keys(npmCommands).length > 0) {
      printSubheader("NPM Manager");
      await runCommands(npmCommands);
    }
  } catch (e: unknown) {
    printError(`${e}`);
    if (e instanceof Error) {
      results.push({ title: "DepKit", status: "error", output: e.message });
    } else {
      results.push({
        title: "DepKit",
        status: "error",
        output: "Unknown error occurred.",
      });
      throw new Error("Error: Unknown error occurred.");
    }
  }
  return results;
}
