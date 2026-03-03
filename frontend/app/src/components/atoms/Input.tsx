import React, { forwardRef, useState } from 'react';
import { TextInput, View, TouchableOpacity, type TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  error?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ error, leftIcon, rightIcon, onRightIconPress, className, style: _style, ...props }, ref) => {
    const [focused, setFocused] = useState(false);
    const isMultiline = props.multiline;

    const borderClass = error
      ? 'border-red-500'
      : focused
        ? 'border-primary-500'
        : 'border-stone-300';

    return (
      <View
        className={`
          flex-row bg-white rounded-xl border
          ${borderClass} px-3
          ${isMultiline ? 'items-start py-3 min-h-[112px]' : 'items-center h-12'}
        `}
      >
        {leftIcon && <View className="mr-2">{leftIcon}</View>}
        <TextInput
          ref={ref}
          className={`flex-1 text-base text-stone-800 ${className ?? ''}`}
          placeholderTextColor="#a8a29e"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
        {rightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            className="ml-2"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
    );
  },
);

Input.displayName = 'Input';
