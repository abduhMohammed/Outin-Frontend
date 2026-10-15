'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function SuccessContent() {
const searchParams = useSearchParams();
const orderNumber = searchParams.get('n') || 'OUT-XXXX';
const whatsAppUrl = searchParams.get('wa') ? decodeURIComponent(searchParams.get('wa')!) : 'https://wa.me/';

return (
    <div className="min-h-screen bg-[#F9F9F9] text-black font-sans flex flex-col items-center justify-center px-4 pb-20">
    <div className="max-w-md w-full bg-white p-8 border border-neutral-200 rounded-sm space-y-6 text-center">
        
        <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-1 font-black text-xl mx-auto">✓</div>

        <div>
        <h1 className="text-xl font-black uppercase tracking-tight">Order Received Successfully!</h1>
        <p className="text-xs text-neutral-500 font-bold mt-1">Order Number: <span className="text-black font-black">{orderNumber}</span></p>
        </div>

        <div className="bg-neutral-50 p-4 border border-neutral-200 rounded-sm text-left space-y-2">
        <p className="text-[11px] font-black uppercase tracking-wider text-black">خطوات الدفع عبر فودافون كاش:</p>
        <ul className="text-xs text-neutral-600 font-medium space-y-1 list-disc list-inside">
            <li>قم بالتحويل عبر فودافون كاش على رقم البراند.</li>
            <li>اضغط الزر أدناه لمراسلتنا عبر واتساب وإرسال صورة تحويل الإيصال.</li>
            <li>سيتم تأكيد وتجهيز طلبك فوراً.</li>
        </ul>
        </div>

        <div className="space-y-3">
        <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-[#FF4500] text-white text-xs font-black uppercase tracking-widest py-4 rounded-sm hover:bg-[#e03d00] transition-colors text-center"
        >
            Continue payment on WhatsApp
        </a>

        <Link
            href="/shop"
            className="block w-full bg-black text-white text-xs font-black uppercase tracking-widest py-4 rounded-sm hover:bg-neutral-800 transition-colors text-center"
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
    <Suspense fallback={<div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center text-xs font-bold">Loading...</div>}>
    <SuccessContent />
    </Suspense>
);
}