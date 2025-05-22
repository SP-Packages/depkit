import { describe, it, expect } from 'vitest';
import { Printer } from '../../src/utils/logger.js';

describe('Printer', () => {
  it('should have enableVerbose method', () => {
    expect(Printer.enableVerbose).toBeDefined();
  });

  it('should have enableQuiet method', () => {
    expect(Printer.enableQuiet).toBeDefined();
  });

  it('should have info method', () => {
    expect(Printer.info).toBeDefined();
  });

  it('should have success method', () => {
    expect(Printer.success).toBeDefined();
  });

  it('should have error method', () => {
    expect(Printer.error).toBeDefined();
  });

  it('should have warning method', () => {
    expect(Printer.warning).toBeDefined();
  });
});
