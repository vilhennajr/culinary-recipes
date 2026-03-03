import { getErrorMessage } from '../../utils/errors';

describe('getErrorMessage', () => {
  it('returns message from an Error instance', () => {
    expect(getErrorMessage(new Error('something failed'))).toBe('something failed');
  });

  it('returns string directly when given a string', () => {
    expect(getErrorMessage('plain string error')).toBe('plain string error');
  });

  it('returns fallback for unknown types', () => {
    expect(getErrorMessage(42)).toBe('Ops! Algo deu errado.');
    expect(getErrorMessage(null)).toBe('Ops! Algo deu errado.');
    expect(getErrorMessage(undefined)).toBe('Ops! Algo deu errado.');
    expect(getErrorMessage({ code: 500 })).toBe('Ops! Algo deu errado.');
  });
});
