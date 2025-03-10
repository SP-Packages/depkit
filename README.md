# **DepKit**

_A lightweight CLI tool to efficiently manage Composer & NPM dependencies in a project._

## **🔍 Why DepKit?**

Managing dependencies across both Composer (PHP) and NPM (JavaScript) can be tedious. `depkit` simplifies the process by providing a single command to:

- 📦 Install dependencies for **both Composer and NPM**
- 🔄 Audit and check for **outdated dependencies**
- 🚀 Ensure **best practices** by running necessary package checks
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

## **📜 Commands Overview**

`depkit` executes predefined commands for Composer and NPM, ensuring dependencies are properly managed.

### **Composer Commands**

| Command                     | Description                                                                           |
| --------------------------- | ------------------------------------------------------------------------------------- |
| `composer -V`               | Checks the installed Composer version                                                 |
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
⚠ [WARNING] Depcheck NPM Packages: Issues found
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
