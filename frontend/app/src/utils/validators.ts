import { z } from 'zod';

export const loginSchema = z.object({
  login: z.string({ required_error: 'Login é obrigatório' }).min(3, 'Mínimo 3 caracteres'),
  password: z.string({ required_error: 'Senha é obrigatória' }).min(6, 'Mínimo 6 caracteres'),
});

export const registerSchema = z.object({
  name: z.string().optional(),
  login: z.string({ required_error: 'Login é obrigatório' }).min(3, 'Mínimo 3 caracteres'),
  password: z.string({ required_error: 'Senha é obrigatória' }).min(6, 'Mínimo 6 caracteres'),
});

export const recipeSchema = z.object({
  name: z.string().optional(),
  categoryId: z.string().nullable().optional(),
  preparationMethod: z
    .string({ required_error: 'Modo de preparo é obrigatório' })
    .min(10, 'Mínimo 10 caracteres'),
  ingredients: z.string().optional(),
  preparationTimeMinutes: z.preprocess(
    (v) => (v === '' || v == null ? undefined : Number(v)),
    z.number({ invalid_type_error: 'Informe um número' }).min(1, 'Mínimo 1 minuto').optional(),
  ),
  servings: z.preprocess(
    (v) => (v === '' || v == null ? undefined : Number(v)),
    z.number({ invalid_type_error: 'Informe um número' }).min(1, 'Mínimo 1').optional(),
  ),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type RecipeFormValues = z.infer<typeof recipeSchema>;
