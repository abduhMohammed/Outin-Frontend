'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/store/useCartStore';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7114/api/v1';

export default function CheckoutPage() {
const router = useRouter();
const { items, subTotal, clearCart } = useCart();
const [isMounted, setIsMounted] = useState(false);

const [customerName, setCustomerName] = useState('');
const [phoneNumber, setPhoneNumber] = useState('');
const [city, setCity] = useState('');
const [address, setAddress] = useState('');
const [notes, setNotes] = useState('');

const [isSubmitting, setIsSubmitting] = useState(false);
const [errors, setErrors] = useState<string[]>([]);

// تأكد من تحميل الـ localStorage أولاً لمنع التوجيه الخاطئ
useEffect(() => {
    setIsMounted(true);
}, []);

useEffect(() => {
    if (isMounted && items.length === 0 && !isSubmitting) {
    router.replace('/cart');
    }
}, [isMounted, items, router, isSubmitting]);

if (!isMounted) {
    return (
    <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center">
        <p className="text-xs font-black uppercase tracking-widest text-neutral-400 animate-pulse">
        Loading Checkout...
        </p>
    </div>
    );
}

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    // Phone validation
    const phoneRegex = /^01[0125][0-9]{8}$/;
    if (!phoneRegex.test(phoneNumber)) {
    setErrors(['رقم الهاتف غير صحيح. يجب أن يبدأ بـ 010, 011, 012, أو 015 ويتكون من 11 رقمًا.']);
    return;
    }

    setIsSubmitting(true);

    const payload = {
    customerName,
    phoneNumber,
    city,
    address,
    notes,
    items: items.map(i => ({ productVariantId: i.variantId, quantity: i.quantity })),
    };

    try {
    const res = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
        if (res.status === 429) {
        setErrors(['لقد قمت بإرسال طلبات كثيرة في وقت قصير. يرجى المحاولة لاحقاً.']);
        } else if (data.errors && Array.isArray(data.errors)) {
        setErrors(data.errors);
        } else if (data.title) {
        setErrors([data.title]);
        } else {
        setErrors(['حدث خطأ أثناء إتمام الطلب. يرجى المحاولة مرة أخرى.']);
        }
        setIsSubmitting(false);
        return;
    }

    // Success
    clearCart();
    router.push(`/order-success?n=${data.orderNumber}&wa=${encodeURIComponent(data.whatsAppUrl)}`);
    } catch (err) {
    console.error(err);
    setErrors(['تعذر الاتصال بالسيرفر. تأكد من اتصال الإنترنت وحاول مجدداً.']);
    setIsSubmitting(false);
    }
};

const deliveryFee = 70;
const total = subTotal + (subTotal > 0 ? deliveryFee : 0);

return (
    <div className="min-h-screen bg-[#F9F9F9] text-black font-sans pb-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pt-6 pb-6">
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">Guest Checkout</h1>
    </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Form */}
        <div className="lg:col-span-2 bg-white p-6 border border-neutral-200 rounded-sm space-y-4">
            <h2 className="text-xs font-black uppercase tracking-wider border-b border-neutral-200 pb-3">Shipping Details</h2>

            {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-sm space-y-1">
                {errors.map((err, idx) => (
                <p key={idx} className="text-xs font-bold text-red-600">{err}</p>
                ))}
            </div>
            )}

            <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-wider text-neutral-600">Full Name</label>
            <input 
                type="text" 
                required 
                value={customerName} 
                onChange={(e) => setCustomerName(e.target.value)} 
                className="w-full border border-neutral-200 p-2.5 text-xs font-bold rounded-sm outline-none focus:border-black" 
                placeholder="أدخل اسمك الكامل"
            />
            </div>

            <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-wider text-neutral-600">Phone Number (Vodafone Cash / Contact)</label>
            <input 
                type="tel" 
                required 
                value={phoneNumber} 
                onChange={(e) => setPhoneNumber(e.target.value)} 
                className="w-full border border-neutral-200 p-2.5 text-xs font-bold rounded-sm outline-none focus:border-black" 
                placeholder="01012345678"
            />
            </div>

            <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-wider text-neutral-600">City</label>
            <input 
                type="text" 
                required 
                value={city} 
                onChange={(e) => setCity(e.target.value)} 
                className="w-full border border-neutral-200 p-2.5 text-xs font-bold rounded-sm outline-none focus:border-black" 
                placeholder="القاهرة، الجيزة..."
            />
            </div>

            <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-wider text-neutral-600">Detailed Address</label>
            <textarea 
                required 
                value={address} 
                onChange={(e) => setAddress(e.target.value)} 
                rows={3}
                className="w-full border border-neutral-200 p-2.5 text-xs font-bold rounded-sm outline-none focus:border-black" 
                placeholder="اسم الشارع، رقم المبنى، الشقة..."
            />
            </div>

            <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-wider text-neutral-600">Notes (Optional)</label>
            <input 
                type="text" 
                value={notes} 
                onChange={(e) => setNotes(e.target.value)} 
                className="w-full border border-neutral-200 p-2.5 text-xs font-bold rounded-sm outline-none focus:border-black" 
                placeholder="أي تعليمات إضافية للتوصيل"
            />
            </div>
        </div>

        {/* Summary */}
        <div className="bg-white p-6 border border-neutral-200 rounded-sm space-y-4">
            <h2 className="text-xs font-black uppercase tracking-wider border-b border-neutral-200 pb-3">Order Summary</h2>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {items.map(item => (
                <div key={item.variantId} className="flex justify-between text-xs font-bold text-neutral-600">
                <span className="line-clamp-1">{item.name} ({item.sizeName}) x{item.quantity}</span>
                <span className="font-black text-black">EGP {item.price * item.quantity}</span>
                </div>
            ))}
            </div>

            <div className="border-t border-neutral-200 pt-3 space-y-2 text-xs font-bold text-neutral-600">
            <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-black font-black">EGP {subTotal}</span>
            </div>
            <div className="flex justify-between">
                <span>Delivery</span>
                <span className="text-black font-black">EGP {deliveryFee}</span>
            </div>
            </div>

            <div className="border-t border-neutral-200 pt-3 flex justify-between text-sm font-black text-black">
            <span>Total</span>
            <span>EGP {total}</span>
            </div>

            <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 text-xs font-black uppercase tracking-widest rounded-sm transition-colors ${isSubmitting ? 'bg-neutral-400 text-neutral-100 cursor-not-allowed' : 'bg-black text-white hover:bg-neutral-800'}`}
            >
            {isSubmitting ? 'Placing Order...' : 'Place Order'}
            </button>
        </div>

        </form>
    </div>
    </div>
);
}