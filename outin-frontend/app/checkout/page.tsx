'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/lib/useCartStore';
import { savePendingOrder } from '@/lib/pendingOrder';
import type { CreateOrderResult } from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7114/api/v1';
const DELIVERY_FEE = 70; // display only, the server calculates the real value
const PHONE_REGEX = /^01[0125][0-9]{8}$/;
const PHONE_ERROR =
'رقم الهاتف غير صحيح. يجب أن يبدأ بـ 010, 011, 012, أو 015 ويتكون من 11 رقمًا.';

export default function CheckoutPage() {
const router = useRouter();
const { items, subTotal, clearCart } = useCart();
const [isMounted, setIsMounted] = useState(false);

const [customerName, setCustomerName] = useState('');
const [phoneNumber, setPhoneNumber] = useState('');
const [phoneTouched, setPhoneTouched] = useState(false);
const [city, setCity] = useState('');
const [address, setAddress] = useState('');
const [notes, setNotes] = useState('');

const [isSubmitting, setIsSubmitting] = useState(false);
const [done, setDone] = useState(false);
const [errors, setErrors] = useState<string[]>([]);

useEffect(() => {
    setIsMounted(true);
}, []);

// an empty cart goes back to /cart, except right after a successful order
useEffect(() => {
    if (isMounted && items.length === 0 && !isSubmitting && !done) {
    router.replace('/cart');
    }
}, [isMounted, items, router, isSubmitting, done]);

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setErrors([]);

    const phone = phoneNumber.trim();
    if (!PHONE_REGEX.test(phone)) {
    setPhoneTouched(true);
    setErrors([PHONE_ERROR]);
    return;
    }

    setIsSubmitting(true);

    const payload = {
    customerName: customerName.trim(),
    phoneNumber: phone,
    city: city.trim(),
    address: address.trim(),
    notes: notes.trim(),
    items: items.map((i) => ({ productVariantId: i.variantId, quantity: i.quantity })),
    };

    try {
    const res = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    // the body may not be JSON (e.g. a gateway error), so never assume it is
    const data = await res.json().catch(() => null);

    if (!res.ok) {
        if (res.status === 429) {
        setErrors(['لقد قمت بإرسال طلبات كثيرة في وقت قصير. يرجى المحاولة لاحقاً.']);
        } else if (data?.errors && Array.isArray(data.errors)) {
        setErrors(data.errors);
        } else if (data?.title) {
        setErrors([data.title]);
        } else {
        setErrors(['حدث خطأ أثناء إتمام الطلب. يرجى المحاولة مرة أخرى.']);
        }
        setIsSubmitting(false);
        return;
    }

    const result = data as CreateOrderResult;

    // saved first, so the "unconfirmed order" banner and the success page fallback work
    savePendingOrder(result.orderNumber, result.whatsAppUrl);
    setDone(true);
    clearCart();
    router.push(
        `/order-success?n=${encodeURIComponent(result.orderNumber)}&wa=${encodeURIComponent(result.whatsAppUrl)}`
    );
    } catch (err) {
    console.error(err);
    setErrors(['تعذر الاتصال بالسيرفر. تأكد من اتصال الإنترنت وحاول مجدداً.']);
    setIsSubmitting(false);
    }
};

if (!isMounted) {
    return (
    <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center">
        <p className="text-xs font-black uppercase tracking-widest text-neutral-400 animate-pulse">
        Loading Checkout...
        </p>
    </div>
    );
}

const total = subTotal + (subTotal > 0 ? DELIVERY_FEE : 0);
const itemsCount = items.reduce((acc, i) => acc + i.quantity, 0);
const phoneInvalid = phoneTouched && phoneNumber !== '' && !PHONE_REGEX.test(phoneNumber.trim());

return (
    <div className="min-h-screen bg-[#F9F9F9] text-black font-sans pb-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pt-6 pb-4">
        <div className="text-[10px] sm:text-xs text-neutral-400 uppercase tracking-widest font-bold mb-3">
        <Link href="/" className="hover:text-black">HOME</Link> /{' '}
        <Link href="/cart" className="hover:text-black">CART</Link> /{' '}
        <span className="text-neutral-700">CHECKOUT</span>
        </div>
        <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
        <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#FF4500] block mb-1">
            CHECKOUT
            </span>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-neutral-900">
            Complete Your Order
            </h1>
        </div>
        </div>
    </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pt-4">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Shipping form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 border border-neutral-200 rounded-sm space-y-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
            <h2 className="text-xs font-black uppercase tracking-widest text-neutral-900 flex items-center gap-2">
                <span className="w-2 h-2 bg-[#FF4500] rounded-full inline-block"></span>
                Shipping Details
            </h2>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#FF4500]">
                Vodafone Cash / Instapay
            </span>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-sm p-3">
            <p className="text-[11px] font-bold text-orange-900 leading-relaxed">
                After placing your order, you will continue on WhatsApp to send your order and the
                Vodafone Cash / Instapay transfer receipt. The order is confirmed once we receive it.
            </p>
            </div>

            {errors.length > 0 && (
            <div className="bg-red-50 border-l-2 border-red-600 p-4 rounded-r-sm space-y-1" role="alert">
                {errors.map((err, idx) => (
                <p key={idx} className="text-xs font-bold text-red-600">{err}</p>
                ))}
            </div>
            )}

            <div className="space-y-4">
            <div className="space-y-1.5">
                <label htmlFor="name" className="text-[10px] font-black uppercase tracking-wider text-neutral-600">
                Full Name
                </label>
                <input
                id="name"
                type="text"
                required
                maxLength={150}
                autoComplete="name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-[#FAFAFA] border border-neutral-200 p-3 text-xs font-bold rounded-sm outline-none focus:border-black focus:bg-white transition-all"
                placeholder="Enter your full name"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                <label htmlFor="phone" className="text-[10px] font-black uppercase tracking-wider text-neutral-600">
                    Phone Number
                </label>
                <input
                    id="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    required
                    maxLength={11}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    onBlur={() => setPhoneTouched(true)}
                    className={`w-full bg-[#FAFAFA] border p-3 text-xs font-bold rounded-sm outline-none focus:bg-white transition-all ${
                    phoneInvalid ? 'border-red-500' : 'border-neutral-200 focus:border-black'
                    }`}
                    placeholder="01012345678"
                />
                {phoneInvalid && (
                    <p className="text-[10px] font-bold text-red-600">
                    Enter a valid Egyptian number, like 01012345678.
                    </p>
                )}
                </div>

                <div className="space-y-1.5">
                <label htmlFor="city" className="text-[10px] font-black uppercase tracking-wider text-neutral-600">
                    City / Governorate
                </label>
                <input
                    id="city"
                    type="text"
                    required
                    maxLength={100}
                    autoComplete="address-level1"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#FAFAFA] border border-neutral-200 p-3 text-xs font-bold rounded-sm outline-none focus:border-black focus:bg-white transition-all"
                    placeholder="Cairo, Giza, Alexandria..."
                />
                </div>
            </div>

            <div className="space-y-1.5">
                <label htmlFor="address" className="text-[10px] font-black uppercase tracking-wider text-neutral-600">
                Detailed Address
                </label>
                <textarea
                id="address"
                required
                maxLength={300}
                autoComplete="street-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                className="w-full bg-[#FAFAFA] border border-neutral-200 p-3 text-xs font-bold rounded-sm outline-none focus:border-black focus:bg-white transition-all resize-none"
                placeholder="Street name, building number, apartment..."
                />
            </div>

            <div className="space-y-1.5">
                <label htmlFor="notes" className="text-[10px] font-black uppercase tracking-wider text-neutral-600">
                Delivery Notes (Optional)
                </label>
                <input
                id="notes"
                type="text"
                maxLength={500}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-[#FAFAFA] border border-neutral-200 p-3 text-xs font-bold rounded-sm outline-none focus:border-black focus:bg-white transition-all"
                placeholder="Any special instructions for delivery"
                />
            </div>
            </div>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 border border-neutral-200 rounded-sm space-y-6 shadow-xs lg:sticky lg:top-6">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
            <h2 className="text-xs font-black uppercase tracking-widest text-neutral-900">
                Order Summary ({itemsCount})
            </h2>
            <Link href="/cart" className="text-[10px] font-black uppercase tracking-wider text-neutral-500 underline hover:text-black">
                Edit cart
            </Link>
            </div>

            <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
            {items.map((item) => (
                <div
                key={item.variantId}
                className="flex items-center justify-between gap-4 py-2 border-b border-neutral-100 last:border-0"
                >
                <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-12 h-14 bg-neutral-100 border border-neutral-200 rounded-sm overflow-hidden flex-shrink-0">
                    <Image
                        src={item.imageUrl || '/images/product/Basic.jpg'}
                        alt={item.name}
                        fill
                        className="object-cover"
                    />
                    </div>
                    <div className="min-w-0">
                    <h4 className="text-xs font-black uppercase text-neutral-900 line-clamp-1">{item.name}</h4>
                    <p className="text-[10px] font-bold text-neutral-500">
                        {item.colorName} / {item.sizeName} (x{item.quantity})
                    </p>
                    </div>
                </div>
                <span className="text-xs font-black text-black whitespace-nowrap">
                    EGP {item.price * item.quantity}
                </span>
                </div>
            ))}
            </div>

            <div className="border-t border-neutral-200 pt-4 space-y-2.5 text-xs font-bold text-neutral-600">
            <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-black font-black">EGP {subTotal}</span>
            </div>
            <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span className="text-black font-black">EGP {DELIVERY_FEE}</span>
            </div>
            </div>

            <div className="border-t border-neutral-200 pt-4 flex justify-between text-base font-black text-black">
            <span>Total Amount</span>
            <span className="text-[#FF4500]">EGP {total}</span>
            </div>

            <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 text-xs font-black uppercase tracking-widest rounded-sm transition-all shadow-sm ${
                isSubmitting
                ? 'bg-neutral-400 text-neutral-100 cursor-not-allowed'
                : 'bg-black hover:bg-neutral-800 text-white hover:shadow-md cursor-pointer'
            }`}
            >
            {isSubmitting ? 'Placing order...' : 'Place Order Now'}
            </button>

            <p className="text-[10px] text-center text-neutral-400 font-bold uppercase tracking-wider">
            Fast delivery across Egypt
            </p>
        </div>
        </form>
    </div>
    </div>
);
}