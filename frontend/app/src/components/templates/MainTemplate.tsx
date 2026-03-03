import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface MainTemplateProps {
  children: React.ReactNode;
  scrollable?: boolean;
  padded?: boolean;
}

export function MainTemplate({ children, scrollable = true, padded = true }: MainTemplateProps) {
  const content = padded ? (
    <View className="flex-1 px-4 pt-4">{children}</View>
  ) : (
    <View className="flex-1">{children}</View>
  );

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['bottom']}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        {scrollable ? (
          <ScrollView
            className="flex-1"
            contentContainerClassName={`pb-8 ${padded ? 'px-4 pt-4' : ''}`}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        ) : (
          content
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
