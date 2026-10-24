'use client';

import { useState, useEffect, useCallback } from 'react';
import { CartItem } from '@/types/api';

const CART_STORAGE_KEY = 'outin_cart';

export function useCart() {
const [items, setItems] = useState<CartItem[]>([]);

const loadCart = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
        setItems(JSON.parse(stored));
    }
    } catch (e) {
    console.error('Failed to load cart', e);
    }
}, []);

useEffect(() => {
    loadCart();

    const handleStorageChange = (e: StorageEvent) => {
    if (e.key === CART_STORAGE_KEY) {
        loadCart();
    }
    };

    const handleCustomCartChange = () => {
    loadCart();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('outin_cart_updated', handleCustomCartChange);

    return () => {
    window.removeEventListener('storage', handleStorageChange);
    window.removeEventListener('outin_cart_updated', handleCustomCartChange);
    };
}, [loadCart]);

const saveCart = (newItems: CartItem[]) => {
    setItems(newItems);
    if (typeof window !== 'undefined') {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems));
    window.dispatchEvent(new Event('outin_cart_updated'));
    }
};

const addItem = (item: CartItem) => {
    const existingIndex = items.findIndex((i) => i.variantId === item.variantId);
    let updated: CartItem[];

    if (existingIndex > -1) {
    const current = items[existingIndex];
    const newQty = Math.min(current.quantity + item.quantity, item.maxStock);
    updated = [...items];
    updated[existingIndex] = { ...current, quantity: newQty };
    } else {
    updated = [...items, item];
    }
    saveCart(updated);
};

const setQty = (variantId: string, quantity: number) => {
    const updated = items.map((item) => {
    if (item.variantId === variantId) {
        const clamped = Math.max(1, Math.min(quantity, item.maxStock));
        return { ...item, quantity: clamped };
    }
    return item;
    });
    saveCart(updated);
};

const removeItem = (variantId: string) => {
    const updated = items.filter((i) => i.variantId !== variantId);
    saveCart(updated);
};

const clearCart = () => {
    saveCart([]);
};

const count = items.reduce((acc, item) => acc + item.quantity, 0);
const subTotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

return { items, count, subTotal, addItem, setQty, removeItem, clearCart };
}