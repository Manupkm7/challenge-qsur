import { act, renderHook } from '@testing-library/react';
import { useHistory, useHistoryLogger } from '../useHistoryStore';
import { CardProductProps } from '@/components/Cards/CardProduct';

const mockCard: Omit<CardProductProps, 'viewMode'> = {
  id: 1,
  title: 'Test Card',
  description: 'Test Description',
  status: 'active',
  price: '100',
  createdAt: new Date(),
  quantity: 5,
  image: 'test.jpg',
};

describe('useHistory', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('inicializa con un array vacío', () => {
    const { result } = renderHook(useHistory);
    expect(result.current.events).toEqual([]);
  });

  it('carga eventos existentes de localStorage', () => {
    const mockEvents = [
      {
        id: '1',
        timestamp: new Date().toISOString(),
        action: 'create',
        cardId: 1,
        cardTitle: 'Test',
        details: 'Test details',
      },
    ];
    localStorage.setItem('card-history-storage', JSON.stringify(mockEvents));

    const { result } = renderHook(useHistory);
    expect(result.current.events).toHaveLength(1);
    expect(result.current.events[0].cardTitle).toBe('Test');
  });

  it('agrega un nuevo evento al historial', () => {
    const { result } = renderHook(useHistory);

    act(() => {
      result.current.addEvent({
        action: 'create',
        cardId: 1,
        cardTitle: 'Test Card',
        details: 'Test details',
      });
    });

    expect(result.current.events).toHaveLength(1);
    expect(result.current.events[0].cardTitle).toBe('Test Card');
    expect(result.current.events[0].action).toBe('create');
  });

  it('limpia el historial', () => {
    const { result } = renderHook(useHistory);

    act(() => {
      result.current.addEvent({
        action: 'create',
        cardId: 1,
        cardTitle: 'Test Card',
        details: 'Test details',
      });
    });

    act(() => {
      result.current.clearHistory();
    });

    expect(result.current.events).toHaveLength(0);
  });
});

describe('useHistoryLogger', () => {
  beforeEach(() => {
    localStorage.clear();
  });
  it('registra la creación de una tarjeta', () => {
    const { result } = renderHook(useHistory);

    act(() => {
      result.current.addEvent({
        action: 'create',
        cardId: mockCard.id,
        cardTitle: mockCard.title,
        details: 'Tarjeta creada',
      });
    });

    const events = JSON.parse(localStorage.getItem('card-history-storage') || '[]');
    expect(events).toHaveLength(1);
    expect(events[0].action).toBe('create');
    expect(events[0].cardTitle).toBe('Test Card');
    expect(events[0].details).toContain('Tarjeta creada');
  });
  it('registra la actualización de una tarjeta', () => {
    const { result } = renderHook(useHistory);

    act(() => {
      result.current.addEvent({
        action: 'update',
        cardId: mockCard.id,
        cardTitle: mockCard.title,
        details:
          'título cambiado de "Test Card" a "Updated Card", precio cambiado de "100" a "200"',
      });
    });

    const events = JSON.parse(localStorage.getItem('card-history-storage') || '[]');
    expect(events).toHaveLength(1);
    expect(events[0].action).toBe('update');
    expect(events[0].details).toContain('título cambiado');
    expect(events[0].details).toContain('precio cambiado');
  });

  it('registra la eliminación de una tarjeta', () => {
    const { result } = renderHook(useHistory);

    act(() => {
      result.current.addEvent({
        action: 'delete',
        cardId: mockCard.id,
        cardTitle: mockCard.title,
        details: 'Tarjeta eliminada',
      });
    });

    const events = JSON.parse(localStorage.getItem('card-history-storage') || '[]');
    expect(events).toHaveLength(1);
    expect(events[0].action).toBe('delete');
    expect(events[0].cardTitle).toBe('Test Card');
    expect(events[0].details).toBe('Tarjeta eliminada');
  });

  it('registra la venta de un item', () => {
    const { result } = renderHook(useHistory);

    act(() => {
      result.current.addEvent({
        action: 'update',
        cardId: mockCard.id,
        cardTitle: mockCard.title,
        details: 'Tarjeta vendida',
      });
    });

    const events = JSON.parse(localStorage.getItem('card-history-storage') || '[]');
    expect(events).toHaveLength(1);
    expect(events[0].action).toBe('update');
    expect(events[0].details).toContain('Se vendió una unidad');
    expect(events[0].details).toContain('Quedan 4 unidades');
  });

  it('maneja errores al cargar eventos de localStorage', () => {
    localStorage.setItem('card-history-storage', 'invalid-json');

    const { result } = renderHook(useHistory);
    expect(result.current.events).toEqual([]);
  });
});
