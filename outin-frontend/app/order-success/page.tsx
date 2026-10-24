'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getPendingOrder, clearPendingOrder, PendingOrder } from '@/lib/pendingOrder';

// only WhatsApp links are accepted, so nobody can send a customer to another site
const isSafeWhatsAppUrl = (url: string | null): url is string => {
if (!url) return false;
try {
    const u = new URL(url);
    return u.protocol === 'https:' && u.hostname === 'wa.me';
} catch {
    return false;
}
};

function SuccessContent() {
const searchParams = useSearchParams();
const [pending, setPending] = useState<PendingOrder | null>(null);
const [ready, setReady] = useState(false);
const [sentConfirmed, setSentConfirmed] = useState(false);

// read localStorage after mount to avoid hydration warnings
useEffect(() => {
    setPending(getPendingOrder());
    setReady(true);
}, []);

if (!ready) return null;

const finalOrderNumber = searchParams.get('n') ?? pending?.orderNumber ?? null;
const candidateUrl = searchParams.get('wa') ?? pending?.whatsAppUrl ?? null;
const whatsAppUrl = isSafeWhatsAppUrl(candidateUrl) ? candidateUrl : null;

if (!finalOrderNumber || !whatsAppUrl) {
    return (
    <div className="min-h-screen bg-[#F9F9F9] text-black font-sans flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white p-8 border border-neutral-200 rounded-sm text-center space-y-4">
        <h1 className="text-xl font-black uppercase tracking-tight">No order found</h1>
        <p className="text-xs text-neutral-500 font-bold">
            We could not find your order details. If you placed an order, contact us on WhatsApp with your phone number.
        </p>
        <Link
            href="/shop"
            className="block w-full bg-black hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-widest py-4 rounded-sm text-center"
        >
            Back to Shop
        </Link>
        </div>
    </div>
    );
}

return (
    <div className="min-h-screen bg-[#F9F9F9] text-black font-sans flex flex-col items-center justify-center px-4 py-16">
    <div className="max-w-md w-full bg-white p-8 sm:p-10 border border-neutral-200 rounded-sm space-y-6 text-center shadow-xs">
        <div className="w-14 h-14 bg-black text-[#FF4500] rounded-full flex items-center justify-center mx-auto font-black text-2xl border-2 border-neutral-900 shadow-sm">
        ✓
        </div>

        <div className="space-y-1">
        <span className="text-[10px] font-black uppercase tracking-widest text-[#FF4500] block">
            Order Received
        </span>
        <h1 className="text-2xl font-black uppercase tracking-tight text-neutral-900">Thank You!</h1>
        <p className="text-xs text-neutral-500 font-bold mt-1">
            Order Number: <span className="text-black font-black select-all">{finalOrderNumber}</span>
        </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-sm p-3 text-left">
        <p className="text-xs font-black text-yellow-900 leading-relaxed">
            Your order is not confirmed yet. Tap the button below, then press Send in WhatsApp
            and attach your transfer receipt.
        </p>
        </div>

        <div className="bg-[#FAFAFA] p-5 border border-neutral-200 rounded-sm text-left space-y-3">
        <p className="text-[11px] font-black uppercase tracking-wider text-black flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#FF4500] rounded-full inline-block"></span>
            How to complete your order
        </p>
        <ol className="text-xs text-neutral-600 font-medium space-y-2 list-decimal list-inside leading-relaxed">
            <li>Transfer the total amount by Vodafone Cash or Instapay to our official number.</li>
            <li>Tap &quot;Send order on WhatsApp&quot; below. Your order details are already written for you.</li>
            <li>Press <strong>Send</strong> and attach the transfer receipt.</li>
            <li>We verify the payment and ship your order.</li>
        </ol>
        </div>

        <div className="space-y-3 pt-2">
        <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-[#FF4500] hover:bg-[#e03d00] text-white text-xs font-black uppercase tracking-widest py-4 rounded-sm transition-all text-center shadow-sm hover:shadow-md"
        >
            Send order on WhatsApp
        </a>

        {sentConfirmed ? (
            <p className="text-[11px] font-bold text-green-700">
            Thanks! We will confirm your order as soon as we verify the payment.
            </p>
        ) : (
            <button
            type="button"
            onClick={() => {
                clearPendingOrder();
                setSentConfirmed(true);
            }}
            className="block w-full text-[11px] font-bold text-neutral-500 underline cursor-pointer"
            >
            I already sent it
            </button>
        )}

        <Link
            href="/shop"
            className="block w-full bg-black hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-widest py-4 rounded-sm transition-all text-center"
        >
            Back to Shop
        </Link>
        </div>
    </div>
    </div>
);
}

export default function OrderSuccessPage() {
return (
    <Suspense
    fallback={
        <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center">
        <p className="text-xs font-black uppercase tracking-widest text-neutral-400 animate-pulse">
            Loading...
        </p>
        </div>
    }
    >
    <SuccessContent />
    </Suspense>
);
}