import React, { useState } from 'react';
import { View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormField } from '../molecules/FormField';
import { Button } from '../atoms/Button';
import { AppText } from '../atoms/AppText';
import { registerSchema, type RegisterFormValues } from '../../utils/validators';

interface RegisterFormProps {
  onSubmit: (values: RegisterFormValues) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

export function RegisterForm({ onSubmit, isLoading, error }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  return (
    <View className="gap-4">
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
            label="Nome (opcional)"
            placeholder="Seu nome"
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            error={errors.name?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="login"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormField
            label="Login"
            placeholder="Escolha um login"
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            error={errors.login?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormField
            label="Senha"
            placeholder="Mín. 6 caracteres"
            secureTextEntry={!showPassword}
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            error={errors.password?.message}
            onRightIconPress={() => setShowPassword((v) => !v)}
            rightIcon={
              <AppText variant="caption" className="text-stone-500">
                {showPassword ? 'Ocultar' : 'Ver'}
              </AppText>
            }
          />
        )}
      />

      <Button
        label="Criar conta"
        fullWidth
        loading={isLoading}
        onPress={handleSubmit(onSubmit)}
        className="mt-2"
      />
    </View>
  );
}
