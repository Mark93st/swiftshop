import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore } from '@/lib/store';

// Reset store state between tests
beforeEach(() => {
  useCartStore.setState({ items: [] });
});

describe('useCartStore - addItem', () => {
  it('adds a new item to an empty cart', () => {
    useCartStore.getState().addItem({ id: '1', name: 'Widget', price: 10, quantity: 1 });
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0].name).toBe('Widget');
  });

  it('increments quantity when adding an existing item', () => {
    const item = { id: '1', name: 'Widget', price: 10, quantity: 2 };
    useCartStore.getState().addItem(item);
    useCartStore.getState().addItem({ ...item, quantity: 3 });
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0].quantity).toBe(5);
  });

  it('adds multiple distinct items', () => {
    useCartStore.getState().addItem({ id: '1', name: 'Widget', price: 10, quantity: 1 });
    useCartStore.getState().addItem({ id: '2', name: 'Gadget', price: 20, quantity: 1 });
    expect(useCartStore.getState().items).toHaveLength(2);
  });
});

describe('useCartStore - removeItem', () => {
  it('removes an item by id', () => {
    useCartStore.getState().addItem({ id: '1', name: 'Widget', price: 10, quantity: 1 });
    useCartStore.getState().addItem({ id: '2', name: 'Gadget', price: 20, quantity: 1 });
    useCartStore.getState().removeItem('1');
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0].id).toBe('2');
  });

  it('is a no-op if the item does not exist', () => {
    useCartStore.getState().addItem({ id: '1', name: 'Widget', price: 10, quantity: 1 });
    useCartStore.getState().removeItem('nonexistent');
    expect(useCartStore.getState().items).toHaveLength(1);
  });
});

describe('useCartStore - updateQuantity', () => {
  beforeEach(() => {
    useCartStore.getState().addItem({ id: '1', name: 'Widget', price: 10, quantity: 2 });
  });

  it('updates quantity to the given value', () => {
    useCartStore.getState().updateQuantity('1', 5);
    expect(useCartStore.getState().items[0].quantity).toBe(5);
  });

  it('enforces a minimum quantity of 1', () => {
    useCartStore.getState().updateQuantity('1', 0);
    expect(useCartStore.getState().items[0].quantity).toBe(1);
  });

  it('enforces a minimum quantity of 1 for negative values', () => {
    useCartStore.getState().updateQuantity('1', -5);
    expect(useCartStore.getState().items[0].quantity).toBe(1);
  });
});

describe('useCartStore - clearCart', () => {
  it('empties the cart', () => {
    useCartStore.getState().addItem({ id: '1', name: 'Widget', price: 10, quantity: 1 });
    useCartStore.getState().addItem({ id: '2', name: 'Gadget', price: 20, quantity: 2 });
    useCartStore.getState().clearCart();
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('is idempotent on an already empty cart', () => {
    useCartStore.getState().clearCart();
    expect(useCartStore.getState().items).toHaveLength(0);
  });
});

describe('useCartStore - totalItems', () => {
  it('returns 0 for an empty cart', () => {
    expect(useCartStore.getState().totalItems()).toBe(0);
  });

  it('returns the sum of all item quantities', () => {
    useCartStore.getState().addItem({ id: '1', name: 'Widget', price: 10, quantity: 2 });
    useCartStore.getState().addItem({ id: '2', name: 'Gadget', price: 20, quantity: 3 });
    expect(useCartStore.getState().totalItems()).toBe(5);
  });
});

describe('useCartStore - totalPrice', () => {
  it('returns 0 for an empty cart', () => {
    expect(useCartStore.getState().totalPrice()).toBe(0);
  });

  it('returns price × quantity for a single item', () => {
    useCartStore.getState().addItem({ id: '1', name: 'Widget', price: 9.99, quantity: 3 });
    expect(useCartStore.getState().totalPrice()).toBeCloseTo(29.97);
  });

  it('returns the sum of price × quantity across all items', () => {
    useCartStore.getState().addItem({ id: '1', name: 'Widget', price: 10, quantity: 2 });
    useCartStore.getState().addItem({ id: '2', name: 'Gadget', price: 5, quantity: 4 });
    expect(useCartStore.getState().totalPrice()).toBe(40);
  });
});
