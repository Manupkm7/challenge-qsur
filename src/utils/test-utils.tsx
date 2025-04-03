import React from 'react';
import { render } from '@testing-library/react';
import { RecoilRoot } from 'recoil';

// Mock de Recoil
jest.mock('recoil', () => ({
  ...jest.requireActual('recoil'),
  RecoilRoot: ({ children }: { children: React.ReactNode }) => children,
  useRecoilState: jest.fn(),
  useRecoilValue: jest.fn(),
  useSetRecoilState: jest.fn(),
}));

// Mock de react-router-dom
jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');
  return {
    ...originalModule,
    useLocation: jest.fn().mockReturnValue({ pathname: '/' }),
  };
});

// Mock de useSales
jest.mock('@/hooks/useSales', () => ({
  useSales: jest.fn(),
}));

// Mock de react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
  },
}));

// Mock de useHistoryLogger
jest.mock('@/hooks/useHistoryStore', () => ({
  useHistoryLogger: jest.fn(),
}));

// Función para configurar los mocks de Recoil
export const setupRecoilMocks = (mocks: Record<string, any>) => {
  const { useRecoilState, useRecoilValue } = require('recoil');

  // Configurar useRecoilState
  (useRecoilState as jest.Mock).mockImplementation((atom) => {
    if (mocks[atom.key]) {
      return [mocks[atom.key].value, mocks[atom.key].setter || jest.fn()];
    }
    return [null, jest.fn()];
  });

  // Configurar useRecoilValue
  (useRecoilValue as jest.Mock).mockImplementation((atom) => {
    if (mocks[atom.key]) {
      return mocks[atom.key].value;
    }
    return null;
  });
};

// Función para configurar el mock de useLocation
export const setupLocationMock = (pathname: string) => {
  const { useLocation } = require('react-router-dom');
  (useLocation as jest.Mock).mockReturnValue({ pathname });
};

// Función para configurar el mock de useSales
export const setupSalesMock = (mockFunctions: Record<string, jest.Mock>) => {
  const { useSales } = require('@/hooks/useSales');
  (useSales as jest.Mock).mockReturnValue(mockFunctions);
};

// Función para configurar el mock de useHistoryLogger
export const setupHistoryLoggerMock = (mockFunctions: Record<string, jest.Mock>) => {
  const { useHistoryLogger } = require('@/hooks/useHistoryStore');
  (useHistoryLogger as jest.Mock).mockReturnValue(mockFunctions);
};

// Componente wrapper para tests
export const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <RecoilRoot>{children}</RecoilRoot>;
};

// Función de renderizado personalizada para tests
export const renderWithRecoil = (ui: React.ReactElement) => {
  return render(<TestWrapper>{ui}</TestWrapper>);
};
