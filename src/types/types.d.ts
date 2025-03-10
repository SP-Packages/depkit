export type Command = {
  title: string;
  command: string;
  behavior: "warn" | "error";
  requires?: string;
};

export type Commands = Record<string, Command>;

export type CommandResult = {
  title: string;
  status: "success" | "warning" | "error";
  output: string;
};

export type DepKitOptions = {
  skipComposer: boolean;
  skipNpm: boolean;
  production: boolean;
};

export interface StdError extends Error {
  stdout: string;
  stderr: string;
  message: string;
}
