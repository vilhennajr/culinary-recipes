import React, { forwardRef } from 'react';
import { View, type TextInput, type TextInputProps } from 'react-native';
import { AppText } from '../atoms/AppText';
import { Input } from '../atoms/Input';

interface FormFieldProps extends TextInputProps {
  label: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
}

export const FormField = forwardRef<TextInput, FormFieldProps>(
  ({ label, error, ...inputProps }, ref) => {
    return (
      <View className="gap-1.5">
        <AppText variant="label">{label}</AppText>
        <Input ref={ref} error={!!error} {...inputProps} />
        {error ? (
          <AppText variant="caption" className="text-red-500">
            {error}
          </AppText>
        ) : null}
      </View>
    );
  },
);

FormField.displayName = 'FormField';
