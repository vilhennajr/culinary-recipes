import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthTemplate } from '../../components/templates/AuthTemplate';
import { LoginForm } from '../../components/organisms/LoginForm';
import { AppText } from '../../components/atoms/AppText';
import { Button } from '../../components/atoms/Button';
import { useAuthStore } from '../../store/auth.store';
import { consumePendingPrefill } from '../../utils/pendingPrefill';
import type { AuthStackParamList } from '../../types';
import type { LoginFormValues } from '../../utils/validators';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export function LoginScreen() {
  const navigation = useNavigation<Nav>();
  const { login, isLoading, error, clearError } = useAuthStore();

  const defaultValues = useMemo(() => {
    const prefill = consumePendingPrefill();
    return { login: prefill?.login ?? '', password: prefill?.password ?? '' };
  }, []);

  const handleSubmit = async (values: LoginFormValues) => {
    clearError();
    await login({ login: values.login, password: values.password });
  };

  return (
    <AuthTemplate
      title="Bem-vindo de volta!"
      subtitle="Entre com sua conta para continuar"
      footer={
        <View className="flex-row items-center gap-1">
          <AppText variant="body-sm">Não tem conta?</AppText>
          <Button
            label="Criar conta"
            variant="ghost"
            size="sm"
            onPress={() => navigation.navigate('Register')}
          />
        </View>
      }
    >
      <LoginForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        error={error}
        defaultValues={defaultValues}
      />
    </AuthTemplate>
  );
}
