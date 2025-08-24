# **DepKit**

<p align="center"><i>_A lightweight CLI tool to efficiently manage Composer & NPM dependencies in a project._</i></p>

<p align="center">
  <a href="https://www.npmjs.com/package/@sp-packages/depkit"><img src="https://img.shields.io/npm/v/@sp-packages/depkit" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/@sp-packages/depkit"><img src="https://img.shields.io/npm/dw/@sp-packages/depkit" alt="npm downloads"></a>
  <a href="https://github.com/SP-Packages/depkit/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@sp-packages/depkit" alt="license"></a>
  <a href="https://github.com/SP-Packages/depkit/actions/workflows/release.yml"><img src="https://github.com/SP-Packages/depkit/actions/workflows/release.yml/badge.svg" alt="build status"></a>
  <a href="https://github.com/semantic-release/semantic-release"><img src="https://img.shields.io/badge/semantic--release-conventionalcommits-e10079?logo=semantic-release" alt="semantic-release"></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/Made%20with-TypeScript-blue.svg" alt="TypeScript"></a>
  <a href="https://prettier.io/"><img src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg" alt="Prettier"></a>
  <a href="https://codecov.io/gh/SP-Packages/depkit"><img src="https://codecov.io/gh/SP-Packages/depkit/graph/badge.svg?token=60X95UNTQL" alt="codecov"></a>
  <a href="https://github.com/SP-Packages/depkit/blob/main/CONTRIBUTING.md"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs welcome"></a>
  <a href="https://github.com/sponsors/iamsenthilprabu"><img src="https://img.shields.io/badge/Sponsor-%E2%9D%A4-pink?logo=github" alt="Sponsor"></a>
</p>

## **🔍 Why DepKit?**

Managing dependencies across both Composer (PHP) and NPM (JavaScript) can be tedious. `depkit` simplifies the process by providing a single command to:

- 📦 Install dependencies for **both Composer and NPM**
- 🔄 Audit and check for **outdated dependencies**
- 🚀 Ensure **best practices** by running necessary package checks
- 📜 **Customizable config file (`depkit.json`)**
- ⚡ Works seamlessly with **WordPress, PHP, and Node.js projects**
- 🛠️ Ideal for **automation in CI/CD, Lando, and local development workflows**

## **✨ Features**

- 📌 Installs production or development dependencies
- 🛠️ Runs security audits to identify vulnerabilities
- 🔄 Checks for outdated packages
- ⚡ Lightweight and fast

## **📝 How DepKit Works**

Before executing any commands, `depkit` checks for the existence of `composer.json` and `package.json` in your project root:

1. **If `composer.json` is found**, it runs Composer commands. Otherwise, it skips Composer execution.
2. **If `package.json` is found**, it runs NPM commands. Otherwise, it skips NPM execution.
3. **If neither file is found**, `depkit` exits with an error, as there are no dependencies to manage.

This ensures that `depkit` **only executes relevant commands** based on your project structure.

## **📦 Installation**

### **Global Installation** (For system-wide use)

```sh
npm install -g @sp-packages/depkit
```

This allows you to use `depkit` globally in your terminal.

### **Local Installation** (For project-specific use)

```sh
npm install @sp-packages/depkit --save-dev
```

Then, run it via:

```sh
npx depkit
```

## **🚀 Usage**

### **Basic Usage**

Run dependency installation and checks for both Composer and NPM:

```sh
depkit
```

### **Options:**

```sh
$ depkit -h
Usage: depkit [options]

A lightweight CLI tool to efficiently manage Composer & NPM dependencies in a project.

Options:
-V, --version output the version number
--skip-composer Skip processing Composer dependencies
--skip-npm Skip processing NPM dependencies
--production Install only production dependencies (exclude dev dependencies)
-c, --config <config> Path to the configuration file (default: depkit.json)
-s, --strict Strict Mode (return exit code 1 even for warnings)
-q, --quiet Disable output
-m, --minimal Essential output
-v, --verbose Enable verbose logging
-h, --help display help for command
```

### **Skipping Composer or NPM Processing**

- Skip **Composer** execution:

  ```sh
  depkit --skip-composer
  ```

- Skip **NPM** execution:

  ```sh
  depkit --skip-npm
  ```

- Skip both (not recommended):

  ```sh
  depkit --skip-composer --skip-npm
  ```

### **Production Mode**

To install only production dependencies (skip `devDependencies`):

```sh
depkit --production
```

This runs:

- `composer install --no-dev`
- `npm install --omit=dev`

## **⚙️ Configuration (`depkit.json`)**

Running the `depkit` command will allow you to automatically create the `depkit.json` file. Alternatively, you can manually create a `depkit.json` or `.depkit.json` in your project root or a custom configuration file and pass it using the `-c` or `--config` parameter:

- `title`: The display name of the tool.
- `type`: The type of package manager used (`npm` or `composer`).
- `prefix`: Specifies how the tool is invoked:
  - `"npm"`: For npm subcommands (can be omitted if `type` is `"npm"`, as it's the default).
  - `"npx"`: For npm custom binaries (installed in `node_modules/.bin`).
  - `"composer"`: For composer subcommands (can be omitted if `type` is `"composer"`, as it's the default).
  - `"vendor"`: For composer custom binaries (installed in `vendor/bin`).
- `command`: The command to run the linter.
- `args`: An array of arguments to pass to the command.
- `behavior`: The behavior of the tool (`error` or `warn`).
- `priority`: The priority of the tool execution (lower number means higher priority).

```json
{
  "TOOLS": {
    "COMPOSER_VERSION": {
      "title": "Checking Composer version",
      "command": "info",
      "type": "composer",
      "behavior": "error",
      "priority": 1,
      "args": ["--version"]
    },
    "COMPOSER_AUDIT": {
      "title": "Auditing PHP Dependencies",
      "command": "audit",
      "type": "composer",
      "behavior": "error",
      "priority": 2
    },
    "NPM_VERSION": {
      "title": "Checking NPM version",
      "prefix": "npm",
      "command": "info",
      "args": ["--version"],
      "type": "npm",
      "behavior": "error",
      "priority": 3
    },
    "DEPCHECK": {
      "title": "Depcheck NPM Packages",
      "prefix": "npx",
      "command": "depcheck",
      "type": "npm",
      "behavior": "warn",
      "requires": "depcheck",
      "priority": 4
    },
    "NPM_OUTDATED": {
      "title": "Outdated NPM Packages",
      "command": "outdated",
      "type": "npm",
      "behavior": "warn",
      "priority": 5
    }
  }
}
```

If no --config option is provided, `depkit` will look for `depkit.json` or `.depkit.json` in the project root by default.

## **📜 Commands Overview**

By default, `depkit` executes predefined commands for Composer and NPM, ensuring dependencies are properly managed.

### **Composer Commands**

| Command                     | Description                                                                           |
| --------------------------- | ------------------------------------------------------------------------------------- |
| `composer -V`               | Checks the installed Composer version                                                 |
| `composer validate`         | Verifying Composer Dependencies                                                       |
| `composer install`          | Installs Composer dependencies                                                        |
| `composer install --no-dev` | Installs Composer dependencies without dev dependencies (when `--production` is used) |
| `composer audit`            | Checks for known security vulnerabilities in dependencies                             |
| `composer outdated`         | Lists outdated Composer dependencies                                                  |

### **NPM Commands**

| Command                  | Description                                                         |
| ------------------------ | ------------------------------------------------------------------- |
| `npm -v`                 | Checks the installed NPM version                                    |
| `npm install`            | Installs NPM dependencies                                           |
| `npm install --omit=dev` | Installs only production dependencies (when `--production` is used) |
| `npm audit --omit=dev`   | Runs an NPM security audit                                          |
| `npm outdated`           | Lists outdated NPM dependencies                                     |

## **📊 Gain Insights Into Your Dependencies**

By running these commands, `depkit` provides a **clear picture** of your project's dependencies:

- 📌 **Composer & NPM Version Checks** – Ensure the correct versions are installed.
- 🔍 **Security Audits** – Identify vulnerabilities in your dependencies.
- 📅 **Outdated Package Reports** – Know when dependencies need updates.
- 🛠 **Seamless Installation** – Manage dependencies across multiple environments.

This helps maintain a **secure, up-to-date, and stable** project setup! 🚀

## **🎯 Example Outputs**

```sh
✔ [SUCCESS] No security vulnerability advisories found.
```

```sh
✔ [SUCCESS] Checking Composer version: Passed
✔ [SUCCESS] Installing PHP Dependencies: Passed
✔ [SUCCESS] Auditing PHP Dependencies: Passed
✔ [SUCCESS] Outdated PHP Dependencies: Passed
✔ [SUCCESS] Checking NPM version: Passed
✔ [SUCCESS] Installing NPM Packages: Passed
⚠ [WARNING] Depcheck NPM Packages: Warning
✔ [SUCCESS] Outdated NPM Packages: Passed
✔ [SUCCESS] Auditing NPM Packages: Passed
```

## **💡 Use Cases**

- **WordPress & PHP Projects** – Handle Composer and NPM dependencies in one go
- **Node.js Projects** – Keep dependencies up to date with ease
- **CI/CD Automation** – Ensure dependencies are installed before builds
- **Lando & Local Dev Environments** – Automate dependency setup

### **1️⃣ Automating Lando Post-Start Hook**

If you're using **Lando**, you can automatically run `depkit` after `lando start`:

```yaml
services:
  appserver:
    run_as_root:
      - depkit
```

### **2️⃣ CI/CD Integration**

Run `depkit` in GitHub Actions, GitLab CI/CD, or other automation scripts:

```yaml
jobs:
  setup:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Install Dependencies
        run: npm ci

      - name: Install DepKit
        run: npm install -g @sp-packages/depkit

      - name: Run DepKit
        run: depkit
```

## **🤝 Contributing**

Contributions are welcome! Please open an issue or submit a pull request on GitHub.

## **📜 License**

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
