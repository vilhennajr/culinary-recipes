// Ensure __DEV__ is defined as false so devSleep resolves immediately in all tests
(global as unknown as Record<string, unknown>).__DEV__ = false;
