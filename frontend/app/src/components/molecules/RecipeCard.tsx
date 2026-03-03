import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import type { Recipe } from '../../types';
import { AppText } from '../atoms/AppText';
import { Badge } from '../atoms/Badge';
import { CATEGORIES } from '../../constants/categories';

interface RecipeCardProps {
  recipe: Recipe;
  onPress: () => void;
  onLongPress?: () => void;
}

export function RecipeCard({ recipe, onPress, onLongPress }: RecipeCardProps) {
  const categoryName = recipe.categoryId
    ? (CATEGORIES.find((c) => c.id === recipe.categoryId)?.name ?? null)
    : null;

  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.75}
      className="bg-white rounded-2xl p-4 mb-3 shadow-sm border border-stone-100"
    >
      <AppText variant="h3" className="mb-1" numberOfLines={1}>
        {recipe.name ?? 'Receita sem título'}
      </AppText>

      <View className="flex-row gap-2 flex-wrap mt-2">
        {categoryName ? <Badge label={`🏷 ${categoryName}`} color="green" /> : null}
        {recipe.preparationTimeMinutes != null && (
          <Badge label={`⏱ ${recipe.preparationTimeMinutes} min`} color="orange" />
        )}
        {recipe.servings != null && <Badge label={`🍽 ${recipe.servings} porções`} color="gray" />}
      </View>

      {recipe.preparationMethod ? (
        <AppText variant="body-sm" className="mt-3 leading-5" numberOfLines={2}>
          {recipe.preparationMethod}
        </AppText>
      ) : null}
    </TouchableOpacity>
  );
}
