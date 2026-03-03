import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthTemplate } from '../../components/templates/AuthTemplate';
import { RegisterForm } from '../../components/organisms/RegisterForm';
import { AppText } from '../../components/atoms/AppText';
import { Button } from '../../components/atoms/Button';
import { useAuthStore } from '../../store/auth.store';
import { setPendingPrefill } from '../../utils/pendingPrefill';
import type { AuthStackParamList } from '../../types';
import type { RegisterFormValues } from '../../utils/validators';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

export function RegisterScreen() {
  const navigation = useNavigation<Nav>();
  const { register, isLoading, error, clearError } = useAuthStore();

  const handleSubmit = async (values: RegisterFormValues) => {
    clearError();
    await register({
      login: values.login,
      password: values.password,
      name: values.name,
    });
    if (!useAuthStore.getState().error) {
      setPendingPrefill(values.login, values.password);
      navigation.replace('Login');
    }
  };

  return (
    <AuthTemplate
      title="Criar Conta"
      subtitle="Preencha os dados para se cadastrar"
      footer={
        <View className="flex-row items-center gap-1">
          <AppText variant="body-sm">Já tem conta?</AppText>
          <Button
            label="Fazer login"
            variant="ghost"
            size="sm"
            onPress={() => navigation.goBack()}
          />
        </View>
      }
    >
      <RegisterForm onSubmit={handleSubmit} isLoading={isLoading} error={error} />
    </AuthTemplate>
  );
}
