import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../useLocalStorage';

describe('useLocalStorage', () => {
  const mockKey = 'test-key';
  const mockInitialValue = { name: 'test' };

  beforeEach(() => {
    // Limpiar localStorage antes de cada prueba
    localStorage.clear();
  });

  it('inicializa con el valor proporcionado cuando no hay datos en localStorage', () => {
    const { result } = renderHook(() => useLocalStorage(mockKey, mockInitialValue));

    expect(result.current[0]).toEqual(mockInitialValue);
  });

  it('carga el valor existente de localStorage', () => {
    // Guardar un valor en localStorage antes de la prueba
    localStorage.setItem(mockKey, JSON.stringify({ name: 'existing' }));

    const { result } = renderHook(() => useLocalStorage(mockKey, mockInitialValue));

    expect(result.current[0]).toEqual({ name: 'existing' });
  });

  it('actualiza el valor en localStorage cuando se cambia el estado', () => {
    const { result } = renderHook(() => useLocalStorage(mockKey, mockInitialValue));

    act(() => {
      result.current[1]({ name: 'updated' });
    });

    expect(result.current[0]).toEqual({ name: 'updated' });
    expect(JSON.parse(localStorage.getItem(mockKey) || '{}')).toEqual({ name: 'updated' });
  });

  it('maneja errores de JSON inválido en localStorage', () => {
    localStorage.setItem(mockKey, 'invalid-json');

    const { result } = renderHook(() => useLocalStorage(mockKey, mockInitialValue));

    expect(result.current[0]).toEqual(mockInitialValue);
  });

  it('actualiza el estado usando una función de actualización', () => {
    const { result } = renderHook(() => useLocalStorage(mockKey, { count: 0 }));

    act(() => {
      result.current[1]((prev) => ({ count: prev.count + 1 }));
    });

    expect(result.current[0]).toEqual({ count: 1 });
  });

  it('no intenta acceder a localStorage cuando window no está definido', () => {
    const originalWindow = global.window;
    // @ts-ignore
    delete global.window;

    const { result } = renderHook(() => useLocalStorage(mockKey, mockInitialValue));

    expect(result.current[0]).toEqual(mockInitialValue);

    // Restaurar window
    global.window = originalWindow;
  });
});
