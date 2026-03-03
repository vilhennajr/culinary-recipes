import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  type TouchableOpacityProps,
} from 'react-native';

type Variant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-primary-500 active:bg-primary-600',
  secondary: 'bg-stone-700 active:bg-stone-800',
  outline: 'bg-transparent border border-primary-500 active:bg-primary-50',
  danger: 'bg-red-500 active:bg-red-600',
  ghost: 'bg-transparent active:bg-stone-100',
};

const textClasses: Record<Variant, string> = {
  primary: 'text-white',
  secondary: 'text-white',
  outline: 'text-primary-600',
  danger: 'text-white',
  ghost: 'text-stone-700',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5',
  md: 'px-5 py-3',
  lg: 'px-6 py-4',
};

const textSizeClasses: Record<Size, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  className,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      disabled={isDisabled}
      className={[
        'rounded-xl items-center justify-center flex-row gap-2',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? 'w-full' : '',
        isDisabled ? 'opacity-50' : '',
        className ?? '',
      ].join(' ')}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'ghost' ? '#ea580c' : '#fff'}
        />
      ) : (
        <Text className={`font-semibold ${textSizeClasses[size]} ${textClasses[variant]}`}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}
