jest.mock('../../services/recipe.service', () => ({
  recipeService: {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  },
}));

import { useRecipeStore } from '../../store/recipe.store';
import { recipeService } from '../../services/recipe.service';
import type { Recipe } from '../../types';

const makeRecipe = (id: string, name = 'Receita'): Recipe => ({
  id,
  userId: 'u-1',
  categoryId: null,
  name,
  preparationTimeMinutes: null,
  servings: null,
  preparationMethod: 'Misturar tudo.',
  ingredients: null,
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
});

const makePage = (data: Recipe[], page = 1, total = data.length) => ({
  data,
  page,
  limit: 5,
  total,
  totalPages: Math.max(1, Math.ceil(total / 5)),
});

beforeEach(() => {
  jest.clearAllMocks();
  useRecipeStore.setState({
    recipes: [],
    currentRecipe: null,
    isLoading: false,
    isFetchingMore: false,
    isSaving: false,
    error: null,
    page: 1,
    totalPages: 1,
    total: 0,
  });
});

describe('fetchRecipes', () => {
  it('sets recipes and pagination state on success', async () => {
    const data = [makeRecipe('r-1'), makeRecipe('r-2')];
    (recipeService.getAll as jest.Mock).mockResolvedValueOnce(makePage(data, 1, 2));

    await useRecipeStore.getState().fetchRecipes();

    const { recipes, page, totalPages, isLoading } = useRecipeStore.getState();
    expect(recipes).toHaveLength(2);
    expect(page).toBe(1);
    expect(totalPages).toBe(1);
    expect(isLoading).toBe(false);
  });

  it('resets to page 1 and replaces recipes on new search', async () => {
    useRecipeStore.setState({ recipes: [makeRecipe('old')] });
    (recipeService.getAll as jest.Mock).mockResolvedValueOnce(makePage([makeRecipe('r-1')], 1, 1));

    await useRecipeStore.getState().fetchRecipes({ name: 'bolo' });

    const { recipes } = useRecipeStore.getState();
    expect(recipes).toHaveLength(1);
    expect(recipes[0].id).toBe('r-1');
  });

  it('sets error and clears loading on failure', async () => {
    (recipeService.getAll as jest.Mock).mockRejectedValueOnce(new Error('Não autenticado.'));

    await useRecipeStore.getState().fetchRecipes();

    const { error, isLoading } = useRecipeStore.getState();
    expect(error).toBe('Não autenticado.');
    expect(isLoading).toBe(false);
  });
});

describe('fetchNextPage', () => {
  it('appends new recipes to existing list', async () => {
    useRecipeStore.setState({
      recipes: [makeRecipe('r-1')],
      page: 1,
      totalPages: 2,
    });
    (recipeService.getAll as jest.Mock).mockResolvedValueOnce(makePage([makeRecipe('r-2')], 2, 2));

    await useRecipeStore.getState().fetchNextPage();

    const { recipes, page } = useRecipeStore.getState();
    expect(recipes).toHaveLength(2);
    expect(page).toBe(2);
  });

  it('deduplicates recipes that appear in both pages', async () => {
    useRecipeStore.setState({
      recipes: [makeRecipe('r-1'), makeRecipe('r-2')],
      page: 1,
      totalPages: 2,
    });
    (recipeService.getAll as jest.Mock).mockResolvedValueOnce(
      makePage([makeRecipe('r-2'), makeRecipe('r-3')], 2, 3),
    );

    await useRecipeStore.getState().fetchNextPage();

    const { recipes } = useRecipeStore.getState();
    expect(recipes).toHaveLength(3);
    expect(recipes.map((r) => r.id)).toEqual(['r-1', 'r-2', 'r-3']);
  });

  it('does nothing when already on last page', async () => {
    useRecipeStore.setState({ page: 2, totalPages: 2 });

    await useRecipeStore.getState().fetchNextPage();

    expect(recipeService.getAll).not.toHaveBeenCalled();
  });

  it('does nothing when already fetching', async () => {
    useRecipeStore.setState({ isFetchingMore: true, page: 1, totalPages: 3 });

    await useRecipeStore.getState().fetchNextPage();

    expect(recipeService.getAll).not.toHaveBeenCalled();
  });
});

describe('fetchById', () => {
  it('sets currentRecipe on success', async () => {
    const recipe = makeRecipe('r-1', 'Bolo de cenoura');
    (recipeService.getById as jest.Mock).mockResolvedValueOnce(recipe);

    await useRecipeStore.getState().fetchById('r-1');

    const { currentRecipe, isLoading } = useRecipeStore.getState();
    expect(currentRecipe).toEqual(recipe);
    expect(isLoading).toBe(false);
  });

  it('sets error when recipe not found', async () => {
    (recipeService.getById as jest.Mock).mockRejectedValueOnce(
      new Error('Receita não encontrada.'),
    );

    await useRecipeStore.getState().fetchById('ghost');

    const { error, currentRecipe } = useRecipeStore.getState();
    expect(error).toBe('Receita não encontrada.');
    expect(currentRecipe).toBeNull();
  });
});

describe('create', () => {
  it('prepends recipe to list and returns it', async () => {
    const newRecipe = makeRecipe('r-new', 'Torta');
    (recipeService.create as jest.Mock).mockResolvedValueOnce(newRecipe);
    useRecipeStore.setState({ recipes: [makeRecipe('r-old')] });

    const result = await useRecipeStore.getState().create({
      preparationMethod: 'Misturar.',
    });

    const { recipes, isSaving } = useRecipeStore.getState();
    expect(result).toEqual(newRecipe);
    expect(recipes[0].id).toBe('r-new');
    expect(recipes).toHaveLength(2);
    expect(isSaving).toBe(false);
  });

  it('sets error and returns null on failure', async () => {
    (recipeService.create as jest.Mock).mockRejectedValueOnce(new Error('Erro ao criar.'));

    const result = await useRecipeStore.getState().create({ preparationMethod: 'Misturar.' });

    expect(result).toBeNull();
    expect(useRecipeStore.getState().error).toBe('Erro ao criar.');
  });
});

describe('update', () => {
  it('replaces recipe in list and returns it', async () => {
    const original = makeRecipe('r-1', 'Original');
    const updated = makeRecipe('r-1', 'Atualizada');
    useRecipeStore.setState({ recipes: [original, makeRecipe('r-2')] });
    (recipeService.update as jest.Mock).mockResolvedValueOnce(updated);

    const result = await useRecipeStore.getState().update('r-1', { name: 'Atualizada' });

    const { recipes } = useRecipeStore.getState();
    expect(result).toEqual(updated);
    expect(recipes[0].name).toBe('Atualizada');
    expect(recipes).toHaveLength(2);
  });

  it('sets error and returns null on failure', async () => {
    (recipeService.update as jest.Mock).mockRejectedValueOnce(new Error('Erro ao atualizar.'));

    const result = await useRecipeStore.getState().update('r-1', { name: 'X' });

    expect(result).toBeNull();
    expect(useRecipeStore.getState().error).toBe('Erro ao atualizar.');
  });
});

describe('remove', () => {
  it('removes recipe from list', async () => {
    useRecipeStore.setState({ recipes: [makeRecipe('r-1'), makeRecipe('r-2')] });
    (recipeService.remove as jest.Mock).mockResolvedValueOnce(undefined);

    await useRecipeStore.getState().remove('r-1');

    const { recipes } = useRecipeStore.getState();
    expect(recipes).toHaveLength(1);
    expect(recipes[0].id).toBe('r-2');
  });

  it('sets error on failure', async () => {
    (recipeService.remove as jest.Mock).mockRejectedValueOnce(new Error('Erro ao remover.'));

    await useRecipeStore.getState().remove('r-ghost');

    expect(useRecipeStore.getState().error).toBe('Erro ao remover.');
  });
});

describe('clearCurrent', () => {
  it('sets currentRecipe to null', () => {
    useRecipeStore.setState({ currentRecipe: makeRecipe('r-1') });

    useRecipeStore.getState().clearCurrent();

    expect(useRecipeStore.getState().currentRecipe).toBeNull();
  });
});

describe('clearError', () => {
  it('sets error to null', () => {
    useRecipeStore.setState({ error: 'some error' });

    useRecipeStore.getState().clearError();

    expect(useRecipeStore.getState().error).toBeNull();
  });
});
