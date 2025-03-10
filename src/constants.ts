import { Commands } from "./types/types.js";
export const COMPOSER_COMMANDS: Commands = {
  version: {
    title: "Checking Composer version",
    command: "composer -V",
    behavior: "error",
  },
  install: {
    title: "Installing PHP Dependencies",
    command: "composer install",
    behavior: "error",
  },
  audit: {
    title: "Auditing PHP Dependencies",
    command: "composer audit",
    behavior: "error",
  },
  outdated: {
    title: "Outdated PHP Dependencies",
    command: "composer outdated",
    behavior: "warn",
  },
};

export const NPM_COMMANDS: Commands = {
  version: {
    title: "Checking NPM version",
    command: "npm -v",
    behavior: "error",
  },
  install: {
    title: "Installing NPM Packages",
    command: "npm install",
    behavior: "error",
  },
  depcheck: {
    title: "Depcheck NPM Packages",
    command: "npx depcheck",
    behavior: "warn",
    requires: "depcheck",
  },
  audit: {
    title: "Auditing NPM Packages",
    command: "npm audit",
    behavior: "error",
  },
  outdated: {
    title: "Outdated NPM Packages",
    command: "npm outdated",
    behavior: "warn",
  },
};
