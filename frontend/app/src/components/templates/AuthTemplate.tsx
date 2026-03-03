import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '../atoms/AppText';

interface AuthTemplateProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function AuthTemplate({ title, subtitle, children, footer }: AuthTemplateProps) {
  return (
    <SafeAreaView className="flex-1 bg-surface">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="flex-grow px-6 py-10 justify-center"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="items-center mb-10">
            <View className="w-16 h-16 bg-primary-500 rounded-2xl items-center justify-center mb-4 shadow-sm">
              <AppText className="text-3xl">🍴</AppText>
            </View>
            <AppText variant="h1" className="text-center">
              {title}
            </AppText>
            {subtitle ? (
              <AppText variant="body-sm" className="text-center mt-1">
                {subtitle}
              </AppText>
            ) : null}
          </View>

          <View className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100">
            {children}
          </View>

          {footer ? <View className="mt-6 items-center">{footer}</View> : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
