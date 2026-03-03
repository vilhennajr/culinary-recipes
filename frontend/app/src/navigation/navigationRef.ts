import { createNavigationContainerRef } from '@react-navigation/native';
import type { AppStackParamList, AuthStackParamList } from '../types';

type RootParamList = AuthStackParamList & AppStackParamList;

export const navigationRef = createNavigationContainerRef<RootParamList>();
