#!/usr/bin/env node
import { program } from "commander";
import { createRequire } from "module";
import { depkit } from "../cli/depkit.js";
import { Printer } from "./../utils/logger.js";
import { readConfig } from "./../core/config.js";

const require = createRequire(import.meta.url);
const { version } = require("../../package.json");

program
  .name("depkit")
  .version(version)
  .description(
    "A lightweight CLI tool to efficiently manage Composer & NPM dependencies in a project.",
  )
  .option("--skip-composer", "Skip processing Composer dependencies")
  .option("--skip-npm", "Skip processing NPM dependencies")
  .option("--production", "Install only production dependencies (exclude dev dependencies)")
  .option("-c, --config <config>", "Path to the configuration file (default: .depkit.json)")
  .option("-q, --quiet", "Disable output")
  .option("-v, --verbose", "Enable verbose logging")
  .action(async (options) => {
    if (options.verbose) {
      Printer.enableVerbose();
    }
    if (options.quiet) {
      Printer.enableQuiet();
    }
    const config = await readConfig(options.config);
    depkit(config, options);
  });

program.parse(process.argv);
