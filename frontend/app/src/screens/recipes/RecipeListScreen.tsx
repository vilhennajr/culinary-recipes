import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, View, TextInput, TouchableOpacity, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RecipeCard } from '../../components/molecules/RecipeCard';
import { RecipeCardSkeleton } from '../../components/molecules/RecipeCardSkeleton';
import { EmptyState } from '../../components/molecules/EmptyState';
import { AppText } from '../../components/atoms/AppText';
import { Button } from '../../components/atoms/Button';
import { useRecipeStore } from '../../store/recipe.store';
import { useAuthStore } from '../../store/auth.store';
import { useDebounce } from '../../hooks/useDebounce';
import type { AppStackParamList, Recipe } from '../../types';

type Nav = NativeStackNavigationProp<AppStackParamList, 'RecipeList'>;

export function RecipeListScreen() {
  const navigation = useNavigation<Nav>();
  const { recipes, isLoading, isFetchingMore, totalPages, page, fetchRecipes, fetchNextPage } =
    useRecipeStore();
  const { user, logout } = useAuthStore();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const fetchingMoreRef = useRef(false);

  useEffect(() => {
    fetchingMoreRef.current = false;
    fetchRecipes({ name: debouncedSearch || undefined });
  }, [debouncedSearch, fetchRecipes]);

  const handleSearch = useCallback((text: string) => {
    setSearch(text);
  }, []);

  const handleEndReached = () => {
    if (fetchingMoreRef.current || isFetchingMore || page >= totalPages) return;
    fetchingMoreRef.current = true;
    fetchNextPage().finally(() => {
      fetchingMoreRef.current = false;
    });
  };

  const renderItem = useCallback(
    ({ item }: { item: Recipe }) => (
      <RecipeCard
        recipe={item}
        onPress={() => navigation.navigate('RecipeDetail', { id: item.id })}
      />
    ),
    [navigation],
  );

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <View className="px-4 pt-4 pb-2 flex-row items-center justify-between">
        <View>
          <AppText variant="h2">Minhas Receitas</AppText>
          {user?.name ? <AppText variant="caption">Olá, {user.name}!</AppText> : null}
        </View>
        <Button label="Sair" variant="ghost" size="sm" onPress={logout} />
      </View>

      <View className="px-4 pb-3">
        <View className="bg-white border border-stone-200 rounded-xl flex-row items-center px-3 h-11">
          <AppText className="mr-2">🔍</AppText>
          <TextInput
            className="flex-1 text-base text-stone-800"
            placeholder="Buscar receitas..."
            placeholderTextColor="#a8a29e"
            value={search}
            onChangeText={handleSearch}
          />
          {search ? (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <AppText className="text-stone-400">✕</AppText>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {isLoading && recipes.length === 0 ? (
        <View className="flex-1 px-4 pt-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <RecipeCardSkeleton key={i} />
          ))}
        </View>
      ) : (
        <FlatList
          data={recipes}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerClassName="px-4 pb-24"
          showsVerticalScrollIndicator={false}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.1}
          refreshControl={
            <RefreshControl
              refreshing={isLoading && recipes.length > 0}
              onRefresh={() => {
                fetchingMoreRef.current = false;
                fetchRecipes({ name: search || undefined });
              }}
              colors={['#f97316']}
              tintColor="#f97316"
            />
          }
          ListEmptyComponent={
            <EmptyState
              title="Nenhuma receita"
              description="Crie sua primeira receita e comece a cozinhar!"
              actionLabel="+ Nova Receita"
              onAction={() => navigation.navigate('RecipeCreate')}
            />
          }
          ListFooterComponent={
            isFetchingMore ? (
              <View>
                {Array.from({ length: 3 }).map((_, i) => (
                  <RecipeCardSkeleton key={i} />
                ))}
              </View>
            ) : null
          }
        />
      )}

      <View className="absolute bottom-8 right-6">
        <TouchableOpacity
          onPress={() => navigation.navigate('RecipeCreate')}
          activeOpacity={0.85}
          className="w-14 h-14 bg-primary-500 rounded-full items-center justify-center shadow-lg"
        >
          <AppText className="text-white text-2xl font-light">+</AppText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
