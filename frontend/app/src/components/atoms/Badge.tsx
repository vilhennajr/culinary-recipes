import React from 'react';
import { View, Text } from 'react-native';

type Color = 'orange' | 'green' | 'blue' | 'gray' | 'red';

interface BadgeProps {
  label: string;
  color?: Color;
  className?: string;
}

const colorClasses: Record<Color, { bg: string; text: string }> = {
  orange: { bg: 'bg-primary-100', text: 'text-primary-700' },
  green: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  blue: { bg: 'bg-sky-100', text: 'text-sky-700' },
  gray: { bg: 'bg-stone-100', text: 'text-stone-600' },
  red: { bg: 'bg-red-100', text: 'text-red-600' },
};

export function Badge({ label, color = 'orange', className }: BadgeProps) {
  const { bg, text } = colorClasses[color];
  return (
    <View className={`${bg} px-2.5 py-1 rounded-full self-start ${className ?? ''}`}>
      <Text className={`${text} text-xs font-medium`}>{label}</Text>
    </View>
  );
}
