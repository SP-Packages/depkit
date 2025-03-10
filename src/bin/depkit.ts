#!/usr/bin/env node
import { program } from "commander";
import { createRequire } from "module";
import { depkit } from "../cli/depkit.js";

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
  .action((options) => {
    depkit(options);
  });

program.parse(process.argv);
