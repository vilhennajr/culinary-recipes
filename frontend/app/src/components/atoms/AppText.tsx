import React from 'react';
import { Text, type TextProps } from 'react-native';

type Variant = 'h1' | 'h2' | 'h3' | 'body' | 'body-sm' | 'caption' | 'label';

interface AppTextProps extends TextProps {
  variant?: Variant;
  color?: string;
}

const variantClasses: Record<Variant, string> = {
  h1: 'text-2xl font-bold text-stone-900',
  h2: 'text-xl font-bold text-stone-900',
  h3: 'text-lg font-semibold text-stone-800',
  body: 'text-base text-stone-700',
  'body-sm': 'text-sm text-stone-600',
  caption: 'text-xs text-stone-500',
  label: 'text-sm font-medium text-stone-700',
};

export function AppText({ variant = 'body', className, ...props }: AppTextProps) {
  return <Text className={`${variantClasses[variant]} ${className ?? ''}`} {...props} />;
}
