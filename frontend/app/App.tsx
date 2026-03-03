import './global.css';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { RootNavigation } from './src/navigation';

export default function App() {
  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaProvider>
        <StatusBar style="dark" backgroundColor="#fff7ed" />
        <RootNavigation />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
