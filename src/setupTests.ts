import '@testing-library/jest-dom';

// Mock de RecoilRoot para pruebas
jest.mock('recoil', () => ({
  ...jest.requireActual('recoil'),
  RecoilRoot: ({ children }: { children: React.ReactNode }) => children,
  useRecoilState: jest.fn(),
  useRecoilValue: jest.fn(),
  useSetRecoilState: jest.fn(),
}));

// Mock de useSales
jest.mock('@/hooks/useSales', () => ({
  useSales: () => ({
    markAsSold: jest.fn(),
    updateSoldItemQuantity: jest.fn(),
    getAverageSalesFromJanuary: jest.fn().mockReturnValue(0),
  }),
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

// Configuración global para pruebas
beforeAll(() => {
  // Aquí puedes agregar cualquier configuración global que necesites
});

afterAll(() => {
  // Limpieza después de todas las pruebas
});
