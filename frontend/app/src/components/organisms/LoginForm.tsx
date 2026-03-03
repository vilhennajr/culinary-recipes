import React, { useState } from 'react';
import { View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormField } from '../molecules/FormField';
import { Button } from '../atoms/Button';
import { AppText } from '../atoms/AppText';
import { loginSchema, type LoginFormValues } from '../../utils/validators';

interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
  defaultValues?: Partial<LoginFormValues>;
}

export function LoginForm({ onSubmit, isLoading, error, defaultValues }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { login: defaultValues?.login ?? '', password: defaultValues?.password ?? '' },
  });

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
        name="login"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormField
            label="Login"
            placeholder="Seu login"
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
            placeholder="Sua senha"
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
        label="Entrar"
        fullWidth
        loading={isLoading}
        onPress={handleSubmit(onSubmit)}
        className="mt-2"
      />
    </View>
  );
}
