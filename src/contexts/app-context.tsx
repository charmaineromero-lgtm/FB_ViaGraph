'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

type Role = 'user' | 'admin';

interface AppContextType {
  role: Role;
  setRole: (role: Role) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>('user');

  return (
    <AppContext.Provider value={{ role, setRole }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
