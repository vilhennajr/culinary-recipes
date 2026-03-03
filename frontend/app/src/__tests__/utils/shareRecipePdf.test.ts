import type { Recipe } from '../../types';

const mockPrintToFileAsync = jest.fn();
const mockIsAvailableAsync = jest.fn();
const mockShareAsync = jest.fn();

jest.mock('expo-print', () => ({
  printToFileAsync: (...args: unknown[]) => mockPrintToFileAsync(...args),
}));

jest.mock('expo-sharing', () => ({
  isAvailableAsync: () => mockIsAvailableAsync(),
  shareAsync: (...args: unknown[]) => mockShareAsync(...args),
}));

import { shareRecipePdf } from '../../utils/shareRecipePdf';

const baseRecipe: Recipe = {
  id: '1',
  userId: 'u1',
  name: 'Bolo de Cenoura',
  categoryId: 'bolos-e-tortas-doces',
  preparationTimeMinutes: 60,
  servings: 8,
  preparationMethod: 'Misture tudo e asse.',
  ingredients: '3 cenouras\n2 ovos\n1 xícara de açúcar',
  createdAt: '2024-01-15T10:00:00.000Z',
  updatedAt: '2024-01-15T10:00:00.000Z',
};

beforeEach(() => {
  jest.clearAllMocks();
  mockPrintToFileAsync.mockResolvedValue({ uri: 'file:///tmp/recipe.pdf' });
  mockIsAvailableAsync.mockResolvedValue(true);
  mockShareAsync.mockResolvedValue(undefined);
});

describe('shareRecipePdf', () => {
  it('gera PDF e abre o diálogo de compartilhamento', async () => {
    await shareRecipePdf(baseRecipe);

    expect(mockPrintToFileAsync).toHaveBeenCalledTimes(1);
    const [{ html }] = mockPrintToFileAsync.mock.calls[0] as [{ html: string; base64: boolean }][];
    expect(html).toContain('Bolo de Cenoura');
    expect(html).toContain('3 cenouras');
    expect(html).toContain('Misture tudo e asse.');

    expect(mockIsAvailableAsync).toHaveBeenCalledTimes(1);

    expect(mockShareAsync).toHaveBeenCalledWith('file:///tmp/recipe.pdf', {
      mimeType: 'application/pdf',
      dialogTitle: 'Compartilhar receita: Bolo de Cenoura',
      UTI: 'com.adobe.pdf',
    });
  });

  it('inclui o nome da categoria no HTML', async () => {
    await shareRecipePdf(baseRecipe);
    const [{ html }] = mockPrintToFileAsync.mock.calls[0] as [{ html: string }][];
    expect(html).toContain('Bolos e tortas doces');
  });

  it('usa "—" quando categoryId é null', async () => {
    await shareRecipePdf({ ...baseRecipe, categoryId: null });
    const [{ html }] = mockPrintToFileAsync.mock.calls[0] as [{ html: string }][];
    expect(html).toContain('—');
  });

  it('usa "—" quando categoryId não existe nas constantes', async () => {
    await shareRecipePdf({ ...baseRecipe, categoryId: 'inexistente' });
    const [{ html }] = mockPrintToFileAsync.mock.calls[0] as [{ html: string }][];
    expect(html).toContain('—');
  });

  it('omite seção de ingredientes quando ingredients é null', async () => {
    await shareRecipePdf({ ...baseRecipe, ingredients: null });
    const [{ html }] = mockPrintToFileAsync.mock.calls[0] as [{ html: string }][];
    expect(html).not.toContain('Ingredientes');
  });

  it('usa "Receita sem título" quando name é null', async () => {
    await shareRecipePdf({ ...baseRecipe, name: null });
    const [{ html }] = mockPrintToFileAsync.mock.calls[0] as [{ html: string }][];
    expect(html).toContain('Receita sem título');
  });

  it('usa "—" para servings null e preparationTimeMinutes null', async () => {
    await shareRecipePdf({ ...baseRecipe, servings: null, preparationTimeMinutes: null });
    const [{ html }] = mockPrintToFileAsync.mock.calls[0] as [{ html: string }][];
    // Both meta fields should show em dash
    const matches = (html.match(/—/g) ?? []).length;
    expect(matches).toBeGreaterThanOrEqual(2);
  });

  it('formata a data de criação no HTML', async () => {
    await shareRecipePdf(baseRecipe);
    const [{ html }] = mockPrintToFileAsync.mock.calls[0] as [{ html: string }][];
    // toLocaleDateString('pt-BR') for 2024-01-15 → '15/01/2024'
    expect(html).toMatch(/15\/01\/2024|2024/);
  });

  it('usa o dialogTitle com nome da receita', async () => {
    await shareRecipePdf(baseRecipe);
    expect(mockShareAsync).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        dialogTitle: 'Compartilhar receita: Bolo de Cenoura',
      }),
    );
  });

  it('usa "Receita" no dialogTitle quando name é null', async () => {
    await shareRecipePdf({ ...baseRecipe, name: null });
    expect(mockShareAsync).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        dialogTitle: 'Compartilhar receita: Receita',
      }),
    );
  });

  it('passa base64: false para printToFileAsync', async () => {
    await shareRecipePdf(baseRecipe);
    const [args] = mockPrintToFileAsync.mock.calls[0] as [{ base64: boolean }][];
    expect(args.base64).toBe(false);
  });

  it('lança erro quando compartilhamento não está disponível', async () => {
    mockIsAvailableAsync.mockResolvedValue(false);
    await expect(shareRecipePdf(baseRecipe)).rejects.toThrow(
      'Compartilhamento não disponível neste dispositivo.',
    );
    expect(mockShareAsync).not.toHaveBeenCalled();
  });

  it('propaga erro de printToFileAsync', async () => {
    mockPrintToFileAsync.mockRejectedValue(new Error('Print falhou'));
    await expect(shareRecipePdf(baseRecipe)).rejects.toThrow('Print falhou');
  });

  it('propaga erro de shareAsync', async () => {
    mockShareAsync.mockRejectedValue(new Error('Share falhou'));
    await expect(shareRecipePdf(baseRecipe)).rejects.toThrow('Share falhou');
  });
});
