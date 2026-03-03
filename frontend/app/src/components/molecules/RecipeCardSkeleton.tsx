import React, { useEffect, useState } from 'react';
import { Animated, View } from 'react-native';

export function RecipeCardSkeleton() {
  const [opacity] = useState(() => new Animated.Value(0.4));

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={{ opacity }}
      className="bg-white rounded-2xl p-4 mb-3 border border-stone-100"
    >
      <View className="h-5 bg-stone-200 rounded-md w-3/4 mb-3" />

      <View className="flex-row gap-2 mt-1">
        <View className="h-5 bg-stone-200 rounded-full w-20" />
        <View className="h-5 bg-stone-200 rounded-full w-16" />
        <View className="h-5 bg-stone-200 rounded-full w-14" />
      </View>

      <View className="h-3 bg-stone-200 rounded-md w-full mt-4" />
      <View className="h-3 bg-stone-200 rounded-md w-5/6 mt-2" />
    </Animated.View>
  );
}
