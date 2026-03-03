import React from 'react';
import { View } from 'react-native';
import { AppText } from '../atoms/AppText';
import { Button } from '../atoms/Button';

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-8 py-16 gap-3">
      <AppText className="text-5xl text-center">🍳</AppText>
      <AppText variant="h2" className="text-center mt-4">
        {title}
      </AppText>
      {description ? (
        <AppText variant="body-sm" className="text-center text-stone-500">
          {description}
        </AppText>
      ) : null}
      {actionLabel && onAction ? (
        <Button label={actionLabel} onPress={onAction} className="mt-4" />
      ) : null}
    </View>
  );
}
