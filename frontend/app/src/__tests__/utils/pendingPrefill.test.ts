import { setPendingPrefill, consumePendingPrefill } from '../../utils/pendingPrefill';

describe('pendingPrefill', () => {
  afterEach(() => {
    consumePendingPrefill();
  });

  it('returns null when nothing was set', () => {
    expect(consumePendingPrefill()).toBeNull();
  });

  it('returns the prefill after setting it', () => {
    setPendingPrefill('john', 'secret123');
    expect(consumePendingPrefill()).toEqual({ login: 'john', password: 'secret123' });
  });

  it('clears the value after first consume', () => {
    setPendingPrefill('john', 'secret123');
    consumePendingPrefill();
    expect(consumePendingPrefill()).toBeNull();
  });

  it('overwrites previous prefill', () => {
    setPendingPrefill('first', 'pass1');
    setPendingPrefill('second', 'pass2');
    expect(consumePendingPrefill()).toEqual({ login: 'second', password: 'pass2' });
  });
});
