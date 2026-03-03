import React from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainTemplate } from '../../components/templates/MainTemplate';
import { RecipeForm } from '../../components/organisms/RecipeForm';
import { useRecipeStore } from '../../store/recipe.store';
import type { AppStackParamList } from '../../types';
import type { RecipeFormValues } from '../../utils/validators';

type Nav = NativeStackNavigationProp<AppStackParamList, 'RecipeCreate'>;

export function RecipeCreateScreen() {
  const navigation = useNavigation<Nav>();
  const { create, isSaving, error } = useRecipeStore();

  const handleSubmit = async (values: RecipeFormValues) => {
    const recipe = await create({
      name: values.name,
      categoryId: values.categoryId ?? null,
      preparationMethod: values.preparationMethod,
      ingredients: values.ingredients,
      preparationTimeMinutes: values.preparationTimeMinutes,
      servings: values.servings,
    });
    if (recipe) {
      navigation.replace('RecipeDetail', { id: recipe.id });
    }
  };

  return (
    <MainTemplate>
      <RecipeForm onSubmit={handleSubmit} isSaving={isSaving} error={error} />
    </MainTemplate>
  );
}
