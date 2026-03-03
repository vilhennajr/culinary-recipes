import { loginSchema, registerSchema, recipeSchema } from '../../utils/validators';

describe('loginSchema', () => {
  it('accepts valid credentials', () => {
    const result = loginSchema.safeParse({ login: 'john', password: 'secret' });
    expect(result.success).toBe(true);
  });

  it('rejects login shorter than 3 chars', () => {
    const result = loginSchema.safeParse({ login: 'ab', password: 'secret' });
    expect(result.success).toBe(false);
  });

  it('rejects password shorter than 6 chars', () => {
    const result = loginSchema.safeParse({ login: 'john', password: '12345' });
    expect(result.success).toBe(false);
  });
});

describe('registerSchema', () => {
  it('accepts all fields', () => {
    const result = registerSchema.safeParse({ login: 'john', password: 'secret', name: 'John' });
    expect(result.success).toBe(true);
  });

  it('accepts without optional name', () => {
    const result = registerSchema.safeParse({ login: 'john', password: 'secret' });
    expect(result.success).toBe(true);
  });
});

describe('recipeSchema', () => {
  it('accepts valid recipe', () => {
    const result = recipeSchema.safeParse({
      preparationMethod: 'Mix everything together.',
      preparationTimeMinutes: 30,
      servings: 2,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.preparationTimeMinutes).toBe(30);
      expect(result.data.servings).toBe(2);
    }
  });

  it('coerces empty string to undefined for numeric fields', () => {
    const result = recipeSchema.safeParse({
      preparationMethod: 'Mix everything together.',
      preparationTimeMinutes: '',
      servings: '',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.preparationTimeMinutes).toBeUndefined();
      expect(result.data.servings).toBeUndefined();
    }
  });

  it('rejects preparationTimeMinutes less than 1', () => {
    const result = recipeSchema.safeParse({
      preparationMethod: 'Mix everything together.',
      preparationTimeMinutes: 0,
    });
    expect(result.success).toBe(false);
  });

  it('rejects preparationMethod shorter than 10 chars', () => {
    const result = recipeSchema.safeParse({ preparationMethod: 'Short' });
    expect(result.success).toBe(false);
  });

  it('all optional fields can be omitted', () => {
    const result = recipeSchema.safeParse({ preparationMethod: 'Mix everything together.' });
    expect(result.success).toBe(true);
  });
});
