import { describe, expect, it } from 'vitest';
import { TransactionManager } from '../../src/client/TransactionManager.js';

describe('TransactionManager', () => {
  it('starts with transaction identifier 0', () => {
    const transactionManager = new TransactionManager();

    expect(transactionManager.next()).toBe(0);
  });

  it('increments the transaction identifier', () => {
    const transactionManager = new TransactionManager();

    expect(transactionManager.next()).toBe(0);
    expect(transactionManager.next()).toBe(1);
    expect(transactionManager.next()).toBe(2);
  });

  it('wraps around after 65535', () => {
    const transactionManager = new TransactionManager();

    for (let index = 0; index < 65535; index += 1) {
      transactionManager.next();
    }

    expect(transactionManager.next()).toBe(65535);
    expect(transactionManager.next()).toBe(0);
  });

  it('resets the transaction identifier', () => {
    const transactionManager = new TransactionManager();

    transactionManager.next();
    transactionManager.next();
    transactionManager.reset();

    expect(transactionManager.next()).toBe(0);
  });
});