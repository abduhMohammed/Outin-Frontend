'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/store/useCartStore';

export default function CartPage() {
const { items, subTotal, setQty, removeItem } = useCart();
const deliveryFee = 70;
const total = subTotal > 0 ? subTotal + deliveryFee : 0;

if (items.length === 0) {
    return (
    <div className="min-h-screen bg-[#F9F9F9] flex flex-col items-center justify-center space-y-4 px-4">
        <h1 className="text-xl font-black uppercase tracking-tight text-neutral-800">Your Cart is Empty</h1>
        <p className="text-xs text-neutral-500 font-medium">Explore our latest university drops and streetwear essentials.</p>
        <Link href="/shop" className="bg-black text-white text-xs font-black uppercase tracking-widest px-6 py-3 rounded-sm hover:bg-neutral-800 transition-colors">
        Continue Shopping
        </Link>
    </div>
    );
}

return (
    <div className="min-h-screen bg-[#F9F9F9] text-black font-sans pb-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pt-6 pb-6">
        <div className="text-[10px] sm:text-xs text-neutral-400 uppercase tracking-widest font-bold mb-2">
        <Link href="/" className="hover:text-black">HOME</Link> / <span className="text-neutral-700">CART</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">Shopping Cart ({items.length})</h1>
    </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Cart Table / Items */}
        <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
            <div key={item.variantId} className="bg-white p-4 border border-neutral-200 rounded-sm flex gap-4 items-center">
                <div className="relative w-20 h-24 bg-neutral-100 flex-shrink-0 border border-neutral-200 rounded-sm overflow-hidden">
                <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                </div>

                <div className="flex-1 space-y-1">
                <h3 className="text-xs font-black uppercase tracking-wide">{item.name}</h3>
                <p className="text-[11px] font-bold text-neutral-500">Color: {item.colorName} / Size: {item.sizeName}</p>
                <p className="text-xs font-black text-black">EGP {item.price}</p>
                </div>

                <div className="flex items-center border border-neutral-200 rounded-sm">
                <button onClick={() => setQty(item.variantId, item.quantity - 1)} className="px-2.5 py-1 text-xs font-bold hover:bg-neutral-100">-</button>
                <span className="px-3 text-xs font-black">{item.quantity}</span>
                <button onClick={() => setQty(item.variantId, item.quantity + 1)} className="px-2.5 py-1 text-xs font-bold hover:bg-neutral-100">+</button>
                </div>

                <div className="text-right space-y-2">
                <p className="text-xs font-black">EGP {item.price * item.quantity}</p>
                <button onClick={() => removeItem(item.variantId)} className="text-[10px] text-neutral-400 hover:text-red-600 font-bold uppercase tracking-wider">Remove</button>
                </div>
            </div>
            ))}
        </div>

        {/* Order Summary */}
        <div className="bg-white p-6 border border-neutral-200 rounded-sm space-y-4">
            <h2 className="text-xs font-black uppercase tracking-wider border-b border-neutral-200 pb-3">Order Summary</h2>
            
            <div className="space-y-2 text-xs font-bold text-neutral-600">
            <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-black font-black">EGP {subTotal}</span>
            </div>
            <div className="flex justify-between">
                <span>Delivery (Estimated)</span>
                <span className="text-black font-black">EGP {deliveryFee}</span>
            </div>
            </div>

            <div className="border-t border-neutral-200 pt-3 flex justify-between text-sm font-black text-black">
            <span>Total</span>
            <span>EGP {total}</span>
            </div>

            <Link
                href="/checkout"
                className="w-full bg-black hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-widest py-4 transition-colors block text-center rounded-sm"
                >
                PROCEED TO CHECKOUT
            </Link>

            <Link href="/shop" className="block text-center text-[10px] text-neutral-500 hover:text-black font-black uppercase tracking-wider pt-2">
            ← Continue Shopping
            </Link>
        </div>

        </div>
    </div>
    </div>
);
}