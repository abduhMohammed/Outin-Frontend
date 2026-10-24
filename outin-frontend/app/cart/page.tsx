'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/lib/useCartStore';

export default function CartPage() {
const { items, count, subTotal, setQty, removeItem, clearCart } = useCart();
const [isMounted, setIsMounted] = useState(false);

useEffect(() => {
    setIsMounted(true);
}, []);

if (!isMounted) {
    return (
    <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center">
        <p className="text-xs font-black uppercase tracking-widest text-neutral-400 animate-pulse">
        Loading Cart...
        </p>
    </div>
    );
}

const deliveryFee = 70;
const total = subTotal + (subTotal > 0 ? deliveryFee : 0);

if (items.length === 0) {
    return (
    <div className="min-h-screen bg-[#F9F9F9] text-black font-sans flex flex-col items-center justify-center p-6 space-y-4">
        <h1 className="text-2xl font-black uppercase tracking-tight">Your Cart is Empty</h1>
        <p className="text-xs text-neutral-500 font-bold uppercase tracking-wider">Looks like you haven't added anything yet.</p>
        <Link 
        href="/shop" 
        className="bg-black hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-widest px-8 py-4 rounded-sm transition-colors mt-2"
        >
        Explore Shop
        </Link>
    </div>
    );
}

return (
    <div className="min-h-screen bg-[#F9F9F9] text-black font-sans pb-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pt-6 pb-4">
        <div className="text-[10px] sm:text-xs text-neutral-400 uppercase tracking-widest font-bold mb-2">
        <Link href="/" className="hover:text-black">HOME</Link> / <span className="text-neutral-700">CART ({count})</span>
        </div>
        <div className="flex justify-between items-center border-b border-neutral-200 pb-4">
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">Shopping Cart ({count})</h1>
        <button 
            onClick={clearCart}
            className="text-xs font-black uppercase tracking-wider text-red-600 hover:text-red-800 transition-colors underline underline-offset-4"
        >
            Clear Cart
        </button>
        </div>
    </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
            {items.map((item) => (
            <div 
                key={item.variantId} 
                className="bg-white border border-neutral-200 p-4 sm:p-6 rounded-sm flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 justify-between shadow-xs transition-all hover:border-neutral-300"
            >
                <div className="flex items-center gap-4">
                <div className="relative w-20 h-24 bg-neutral-100 border border-neutral-200 rounded-sm flex-shrink-0 overflow-hidden">
                    <Image 
                    src={item.imageUrl || '/images/product/Basic.jpg'} 
                    alt={item.name} 
                    fill 
                    className="object-cover" 
                    />
                </div>
                <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#FF4500]">OUTIN</span>
                    <h3 className="text-sm font-black uppercase tracking-tight text-neutral-900">{item.name}</h3>
                    <p className="text-xs font-bold text-neutral-500">
                    Color: <span className="text-black">{item.colorName}</span> / Size: <span className="text-black">{item.sizeName}</span>
                    </p>
                    <p className="text-xs font-black text-black pt-1">
                    EGP {item.price}
                    </p>
                </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-neutral-100 gap-3">
                <span className="text-sm font-black text-black sm:hidden">Total: EGP {item.price * item.quantity}</span>
                
                {/* Quantity Controller */}
                <div className="flex items-center border border-neutral-200 rounded-sm bg-neutral-50">
                    <button 
                    onClick={() => setQty(item.variantId, item.quantity - 1)}
                    className="px-3 py-1.5 text-xs font-bold hover:bg-neutral-200 transition-colors"
                    >
                    -
                    </button>
                    <span className="px-3 py-1.5 text-xs font-black min-w-[28px] text-center">{item.quantity}</span>
                    <button 
                    onClick={() => setQty(item.variantId, item.quantity + 1)}
                    className="px-3 py-1.5 text-xs font-bold hover:bg-neutral-200 transition-colors"
                    >
                    +
                    </button>
                </div>

                <div className="hidden sm:block text-sm font-black text-black pt-1">
                    EGP {item.price * item.quantity}
                </div>

                <button 
                    onClick={() => removeItem(item.variantId)}
                    className="text-[10px] font-black uppercase tracking-wider text-neutral-400 hover:text-red-600 transition-colors mt-1"
                >
                    Remove
                </button>
                </div>
            </div>
            ))}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4 bg-white p-6 border border-neutral-200 rounded-sm space-y-4">
            <h2 className="text-xs font-black uppercase tracking-wider border-b border-neutral-200 pb-3">Order Summary</h2>

            <div className="space-y-2 text-xs font-bold text-neutral-600">
            <div className="flex justify-between">
                <span>Subtotal ({count} items)</span>
                <span className="text-black font-black">EGP {subTotal}</span>
            </div>
            <div className="flex justify-between">
                <span>Estimated Delivery</span>
                <span className="text-black font-black">EGP {deliveryFee}</span>
            </div>
            </div>

            <div className="border-t border-neutral-200 pt-3 flex justify-between text-sm font-black text-black">
            <span>Total</span>
            <span>EGP {total}</span>
            </div>

            <Link
            href="/checkout"
            className="w-full bg-black hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-widest py-4 transition-colors block text-center rounded-sm shadow-sm"
            >
            Proceed to Checkout
            </Link>

            <div className="pt-2">
            <Link 
                href="/shop"
                className="w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-black uppercase tracking-widest py-3 transition-colors block text-center rounded-sm"
            >
                Continue Shopping
            </Link>
            </div>
        </div>

        </div>
    </div>
    </div>
);
}