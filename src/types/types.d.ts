export type Command = {
  title: string;
  prefix?: string;
  command: string;
  args?: string[];
  type: 'composer' | 'npm';
  behavior: 'warn' | 'error';
  requires?: string;
  priority?: number;
};

export type Commands = Record<string, Command>;

export type CommandResult = {
  title: string;
  status: 'success' | 'warning' | 'error';
  output: string;
};

export type DepKitOptions = {
  skipComposer: boolean;
  skipNpm: boolean;
  production: boolean;
  strict: boolean;
  quiet: boolean;
  minimal: boolean;
  verbose: boolean;
};

export type Config = {
  TOOLS: Commands;
};
