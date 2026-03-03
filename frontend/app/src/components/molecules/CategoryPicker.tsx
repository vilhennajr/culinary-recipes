import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { AppText } from '../atoms/AppText';
import { CATEGORIES } from '../../constants/categories';

interface CategoryPickerProps {
  value: string | null | undefined;
  onChange: (id: string | null) => void;
  error?: string;
}

export function CategoryPicker({ value, onChange, error }: CategoryPickerProps) {
  return (
    <View className="gap-1.5">
      <AppText variant="label">Categoria</AppText>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8, paddingVertical: 2 }}
      >
        <TouchableOpacity
          onPress={() => onChange(null)}
          className={`px-4 py-2 rounded-full border ${
            !value ? 'bg-primary-600 border-primary-600' : 'bg-white border-stone-300'
          }`}
        >
          <AppText
            variant="body-sm"
            className={!value ? 'text-white font-medium' : 'text-stone-600'}
          >
            Nenhuma
          </AppText>
        </TouchableOpacity>

        {CATEGORIES.map((cat) => {
          const selected = value === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              onPress={() => onChange(selected ? null : cat.id)}
              className={`px-4 py-2 rounded-full border ${
                selected ? 'bg-primary-600 border-primary-600' : 'bg-white border-stone-300'
              }`}
            >
              <AppText
                variant="body-sm"
                className={selected ? 'text-white font-medium' : 'text-stone-600'}
              >
                {cat.name}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      {error ? (
        <AppText variant="caption" className="text-red-500">
          {error}
        </AppText>
      ) : null}
    </View>
  );
}
