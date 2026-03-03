import React, { useEffect } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '../../components/atoms/AppText';
import { Badge } from '../../components/atoms/Badge';
import { Spinner } from '../../components/atoms/Spinner';
import { Button } from '../../components/atoms/Button';
import { useRecipeStore } from '../../store/recipe.store';
import type { AppStackParamList } from '../../types';
import { CATEGORIES } from '../../constants/categories';

type RouteP = RouteProp<AppStackParamList, 'RecipeDetail'>;
type Nav = NativeStackNavigationProp<AppStackParamList, 'RecipeDetail'>;

export function RecipeDetailScreen() {
  const route = useRoute<RouteP>();
  const navigation = useNavigation<Nav>();
  const { id } = route.params;
  const { currentRecipe, isLoading, isSaving, error, fetchById, remove, clearCurrent, clearError } =
    useRecipeStore();

  useEffect(() => {
    fetchById(id);
    return () => {
      clearCurrent();
      clearError();
    };
  }, [id, fetchById, clearCurrent, clearError]);

  const handleDelete = () => {
    Alert.alert('Excluir receita', 'Tem certeza? Essa ação não pode ser desfeita.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          await remove(id);
          if (!useRecipeStore.getState().error) {
            navigation.goBack();
          }
        },
      },
    ]);
  };

  if (isLoading || !currentRecipe) {
    return <Spinner fullScreen />;
  }

  const { name, preparationTimeMinutes, servings, ingredients, preparationMethod, categoryId } =
    currentRecipe;

  const categoryName = categoryId
    ? (CATEGORIES.find((c) => c.id === categoryId)?.name ?? null)
    : null;

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['bottom']}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 py-6 pb-10"
        showsVerticalScrollIndicator={false}
      >
        {error ? (
          <View className="mb-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <AppText variant="body-sm" className="text-red-600">
              {error}
            </AppText>
          </View>
        ) : null}

        <AppText variant="h1" className="mb-4">
          {name ?? 'Receita sem título'}
        </AppText>

        <View className="flex-row gap-2 flex-wrap mb-6">
          {categoryName ? <Badge label={`🏷 ${categoryName}`} color="green" /> : null}
          {preparationTimeMinutes != null && (
            <Badge label={`⏱ ${preparationTimeMinutes} min`} color="orange" />
          )}
          {servings != null && <Badge label={`🍽 ${servings} porções`} color="gray" />}
        </View>

        {ingredients ? (
          <View className="mb-6 bg-white rounded-2xl p-4 border border-stone-100">
            <AppText variant="h3" className="mb-3">
              🧂 Ingredientes
            </AppText>
            <AppText variant="body" className="leading-7">
              {ingredients}
            </AppText>
          </View>
        ) : null}

        <View className="mb-6 bg-white rounded-2xl p-4 border border-stone-100">
          <AppText variant="h3" className="mb-3">
            👨‍🍳 Modo de Preparo
          </AppText>
          <AppText variant="body" className="leading-7">
            {preparationMethod}
          </AppText>
        </View>

        <View className="flex-row gap-3 mt-2">
          <Button
            label="Editar"
            variant="outline"
            size="md"
            className="flex-1"
            onPress={() => navigation.navigate('RecipeEdit', { id })}
          />
          <Button
            label={isSaving ? '' : 'Excluir'}
            variant="danger"
            size="md"
            className="flex-1"
            loading={isSaving}
            onPress={handleDelete}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
