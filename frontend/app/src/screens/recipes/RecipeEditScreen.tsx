import React, { useEffect } from 'react';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainTemplate } from '../../components/templates/MainTemplate';
import { RecipeForm } from '../../components/organisms/RecipeForm';
import { Spinner } from '../../components/atoms/Spinner';
import { useRecipeStore } from '../../store/recipe.store';
import type { AppStackParamList } from '../../types';
import type { RecipeFormValues } from '../../utils/validators';

type RouteP = RouteProp<AppStackParamList, 'RecipeEdit'>;
type Nav = NativeStackNavigationProp<AppStackParamList, 'RecipeEdit'>;

export function RecipeEditScreen() {
  const route = useRoute<RouteP>();
  const navigation = useNavigation<Nav>();
  const { id } = route.params;
  const { currentRecipe, isLoading, isSaving, error, fetchById, update, clearCurrent } =
    useRecipeStore();

  useEffect(() => {
    fetchById(id);
    return () => clearCurrent();
  }, [id, fetchById, clearCurrent]);

  if (isLoading || !currentRecipe) {
    return <Spinner fullScreen />;
  }

  const defaultValues: Partial<RecipeFormValues> = {
    name: currentRecipe.name ?? '',
    categoryId: currentRecipe.categoryId ?? null,
    preparationMethod: currentRecipe.preparationMethod,
    ingredients: currentRecipe.ingredients ?? '',
    preparationTimeMinutes: currentRecipe.preparationTimeMinutes ?? undefined,
    servings: currentRecipe.servings ?? undefined,
  };

  const handleSubmit = async (values: RecipeFormValues) => {
    const updated = await update(id, {
      name: values.name,
      categoryId: values.categoryId ?? null,
      preparationMethod: values.preparationMethod,
      ingredients: values.ingredients,
      preparationTimeMinutes: values.preparationTimeMinutes,
      servings: values.servings,
    });
    if (updated) {
      navigation.navigate('RecipeDetail', { id });
    }
  };

  return (
    <MainTemplate>
      <RecipeForm
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        isSaving={isSaving}
        error={error}
      />
    </MainTemplate>
  );
}
