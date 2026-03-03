import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RecipeListScreen } from '../screens/recipes/RecipeListScreen';
import { RecipeDetailScreen } from '../screens/recipes/RecipeDetailScreen';
import { RecipeCreateScreen } from '../screens/recipes/RecipeCreateScreen';
import { RecipeEditScreen } from '../screens/recipes/RecipeEditScreen';
import type { AppStackParamList } from '../types';

const Stack = createNativeStackNavigator<AppStackParamList>();

export function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#fff7ed' },
        headerTintColor: '#c2410c',
        headerTitleStyle: { fontWeight: '600' },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: '#fafaf9' },
      }}
    >
      <Stack.Screen
        name="RecipeList"
        component={RecipeListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RecipeDetail"
        component={RecipeDetailScreen}
        options={{ title: 'Receita' }}
      />
      <Stack.Screen
        name="RecipeCreate"
        component={RecipeCreateScreen}
        options={{ title: 'Nova Receita' }}
      />
      <Stack.Screen
        name="RecipeEdit"
        component={RecipeEditScreen}
        options={{ title: 'Editar Receita' }}
      />
    </Stack.Navigator>
  );
}
