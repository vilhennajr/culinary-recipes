import React from 'react';
import { View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormField } from '../molecules/FormField';
import { CategoryPicker } from '../molecules/CategoryPicker';
import { Button } from '../atoms/Button';
import { AppText } from '../atoms/AppText';
import { recipeSchema, type RecipeFormValues } from '../../utils/validators';
import { Input } from '../atoms/Input';

interface RecipeFormProps {
  defaultValues?: Partial<RecipeFormValues>;
  onSubmit: (values: RecipeFormValues) => Promise<void>;
  isSaving?: boolean;
  error?: string | null;
}

export function RecipeForm({ defaultValues, onSubmit, isSaving, error }: RecipeFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeSchema),
    defaultValues: defaultValues ?? {},
  });

  return (
    <View className="gap-5">
      {error ? (
        <View className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <AppText variant="body-sm" className="text-red-600">
            {error}
          </AppText>
        </View>
      ) : null}

      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormField
            label="Nome da Receita"
            placeholder="Ex: Bolo de Cenoura"
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            error={errors.name?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="categoryId"
        render={({ field: { onChange, value } }) => (
          <CategoryPicker value={value} onChange={onChange} error={errors.categoryId?.message} />
        )}
      />

      <View className="flex-row gap-3">
        <View className="flex-1">
          <Controller
            control={control}
            name="preparationTimeMinutes"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormField
                label="Tempo (min)"
                placeholder="30"
                keyboardType="numeric"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value?.toString()}
                error={errors.preparationTimeMinutes?.message}
              />
            )}
          />
        </View>
        <View className="flex-1">
          <Controller
            control={control}
            name="servings"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormField
                label="Porções"
                placeholder="4"
                keyboardType="numeric"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value?.toString()}
                error={errors.servings?.message}
              />
            )}
          />
        </View>
      </View>

      <View className="gap-1.5">
        <AppText variant="label">Ingredientes</AppText>
        <Controller
          control={control}
          name="ingredients"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              placeholder="Liste os ingredientes..."
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              error={!!errors.ingredients}
            />
          )}
        />
        {errors.ingredients ? (
          <AppText variant="caption" className="text-red-500">
            {errors.ingredients.message}
          </AppText>
        ) : null}
      </View>

      <View className="gap-1.5">
        <AppText variant="label">Modo de Preparo *</AppText>
        <Controller
          control={control}
          name="preparationMethod"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              placeholder="Descreva o modo de preparo..."
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              error={!!errors.preparationMethod}
              className="min-h-[144px]"
            />
          )}
        />
        {errors.preparationMethod ? (
          <AppText variant="caption" className="text-red-500">
            {errors.preparationMethod.message}
          </AppText>
        ) : null}
      </View>

      <Button
        label="Salvar Receita"
        fullWidth
        loading={isSaving}
        onPress={handleSubmit(onSubmit)}
        size="lg"
      />
    </View>
  );
}
