import pLimit from "p-limit";
import { spawn } from "child_process";
import { Printer } from "../utils/logger.js";
import { isToolAvailable } from "../utils/helper.js";
import { Command, Commands, CommandResult } from "../types/types.js";

const CONCURRENCY_LIMIT = 4;
const limit = pLimit(CONCURRENCY_LIMIT);

/**
 * Executes a single command and buffers output.
 * @param key - The command key
 * @param commandDetails - The details of the command
 * @returns The result of the command execution
 */
async function executeCommandBuffered(commandDetails: Command): Promise<CommandResult> {
  const { title, type, command, prefix, args, behavior, requires } = commandDetails;
  if ((requires && !isToolAvailable(requires)) || !isToolAvailable(command, type)) {
    Printer.subheader(title);
    const message = `Skipping ${title}: Required tool '${requires || command}' not found.`;
    if (behavior === "warn") {
      Printer.warning(message);
      return { title, status: "warning", output: `Missing tool: ${requires || command}` };
    } else {
      Printer.error(message);
      return { title, status: "error", output: `Missing tool: ${requires || command}` };
    }
  }

  let cmd = command;
  if (prefix) {
    cmd = `${prefix} ${cmd}`;
  } else if (type === "npm") {
    cmd = `npm ${cmd}`;
  } else if (type === "composer") {
    cmd = `composer ${cmd}`;
  }
  if (args?.length) {
    cmd += ` ${args.join(" ")}`;
  }

  return new Promise((resolve) => {
    const childProcess = spawn(cmd, { shell: true, env: { ...process.env, FORCE_COLOR: "true" } });

    let stdoutBuffer = "";
    let stderrBuffer = "";
    let message = "";

    childProcess.stdout.on("data", (data) => {
      stdoutBuffer += data.toString();
    });

    childProcess.stderr.on("data", (data) => {
      stderrBuffer += data.toString();
    });

    childProcess.on("close", (code) => {
      Printer.subheader(title);
      message = stdoutBuffer + stderrBuffer;

      if (code === 0) {
        resolve({ title, status: "success", output: stdoutBuffer.trim() });
        Printer.success("Successfully Completed.");
      } else {
        if (behavior === "warn") {
          resolve({ title, status: "warning", output: stderrBuffer.trim() || "Warning" });
          Printer.warning("Failed with warnings.");
        } else {
          resolve({ title, status: "error", output: stderrBuffer.trim() || "Error" });
          Printer.error("Failed to complete.");
        }
      }
      if (message) {
        Printer.log(`${cmd}`);
        Printer.log(message.trim());
      } else {
        Printer.log("No output.");
      }
    });
  });
}

/**
 * Executes the given commands.
 * @param commands - The commands to execute
 * @returns The results of the command execution
 */
export async function executeCommands(commands: Commands): Promise<CommandResult[]> {
  const results: CommandResult[] = [];
  if (Object.keys(commands).length > 0) {
    // Run commands in parallel with controlled concurrency
    const commandPromises = Object.keys(commands).map((key) =>
      limit(() => executeCommandBuffered(commands[key])),
    );

    // Execute all commands and collect results
    const commandResults = await Promise.all(commandPromises);
    results.push(...commandResults);
  }
  return results;
}
