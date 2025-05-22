import pLimit from 'p-limit';
import { spawn } from 'child_process';
import { Ora, Printer } from '../utils/logger.js';
import { isToolAvailable } from '../utils/helper.js';
import { Command, Commands, CommandResult } from '../types/types.js';

const CONCURRENCY_LIMIT = 4;
const limit = pLimit(CONCURRENCY_LIMIT);

/**
 * Executes a single command and buffers output.
 * @param key - The command key
 * @param commandDetails - The details of the command
 * @param spinner - The spinner instance for logging
 * @returns The result of the command execution
 */
async function executeCommandBuffered(
  commandDetails: Command,
  spinner: Ora
): Promise<CommandResult> {
  const { title, type, command, prefix, args, behavior, requires } =
    commandDetails;
  spinner.text = title;
  if (
    (requires && !isToolAvailable(requires)) ||
    !isToolAvailable(command, type)
  ) {
    Printer.log(title, 'subheader');

    const message = `Skipping ${title}: Required tool '${requires || command}' not found.`;
    if (behavior === 'warn') {
      Printer.log(message, 'warning');
      return {
        title,
        status: 'warning',
        output: `Missing tool: ${requires || command}`
      };
    } else {
      if (!Printer.isVerbose) {
        spinner.clear().start();
        Printer.plainSubheader(title);
      }
      Printer.error(message);
      return {
        title,
        status: 'error',
        output: `Missing tool: ${requires || command}`
      };
    }
  }

  let cmd = command;
  if (prefix) {
    cmd = `${prefix} ${cmd}`;
  } else if (type === 'npm') {
    cmd = `npm ${cmd}`;
  } else if (type === 'composer') {
    cmd = `composer ${cmd}`;
  }
  if (args?.length) {
    cmd += ` ${args.join(' ')}`;
  }

  return new Promise((resolve) => {
    const childProcess = spawn(cmd, {
      shell: true,
      env: { ...process.env, FORCE_COLOR: 'true' }
    });

    let stdoutBuffer = '';
    let stderrBuffer = '';
    let message = '';

    childProcess.stdout.on('data', (data) => {
      stdoutBuffer += data.toString();
    });

    childProcess.stderr.on('data', (data) => {
      stderrBuffer += data.toString();
    });

    childProcess.on('close', (code) => {
      Printer.log(title, 'subheader');
      message = stdoutBuffer + stderrBuffer;

      if (code === 0) {
        resolve({ title, status: 'success', output: stdoutBuffer.trim() });
        Printer.log(`${title}- Successfully Completed.`, 'success');
        Printer.log(`${cmd}`);
        Printer.log(message.trim());
      } else {
        if (behavior === 'warn') {
          resolve({
            title,
            status: 'warning',
            output: stderrBuffer.trim() || 'Warning'
          });
          Printer.log(`${title}- Failed with warnings.`, 'warning');
          Printer.log(`${cmd}`);
          Printer.log(message.trim());
        } else {
          resolve({
            title,
            status: 'error',
            output: stderrBuffer.trim() || 'Error'
          });
          Printer.log(`${title}- Failed to complete.`, 'error');
          Printer.log(`${cmd}`);
          if (!Printer.isVerbose) {
            spinner.clear().start();
            Printer.plainSubheader(title);
          }
          Printer.error(message.trim());
        }
      }
    });
  });
}

/**
 * Executes the given commands.
 * @param commands - The commands to execute
 * @param spinner - The spinner instance for logging
 * @returns The results of the command execution
 */
export async function executeCommands(
  commands: Commands,
  spinner: Ora
): Promise<CommandResult[]> {
  const results: CommandResult[] = [];
  if (Object.keys(commands).length > 0) {
    // Run commands in parallel with controlled concurrency
    const commandPromises = Object.keys(commands).map((key) =>
      limit(() => executeCommandBuffered(commands[key], spinner))
    );

    // Execute all commands and collect results
    const commandResults = await Promise.all(commandPromises);
    results.push(...commandResults);
  }
  return results;
}
