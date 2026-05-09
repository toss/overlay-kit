import { type Provider, createContext, useContext } from 'react';

export type CreateContextReturn<T> = [Provider<T>, () => T];

export function createSafeContext<T>(displayName?: string): CreateContextReturn<T> {
  const NullSymbol = Symbol('Null');

  const Context = createContext<T | typeof NullSymbol>(NullSymbol);
  Context.displayName = displayName ?? 'SafeContext';

  function useSafeContext() {
    const context = useContext(Context);

    if (context === NullSymbol) {
      const error = new Error(`[${Context.displayName}]: Provider not found.`);
      error.name = '[Error] Context';

      throw error;
    }

    return context;
  }

  return [Context.Provider, useSafeContext];
}
