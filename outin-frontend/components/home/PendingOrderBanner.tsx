'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { getPendingOrder, clearPendingOrder, PendingOrder } from '@/lib/pendingOrder';

export default function PendingOrderBanner() {
const [order, setOrder] = useState<PendingOrder | null>(null);
const pathname = usePathname();

useEffect(() => {
    setOrder(getPendingOrder());
}, [pathname]);

// Don't render if no pending order exists, or on order-success / admin pages
if (!order || pathname.startsWith('/order-success') || pathname.startsWith('/admin')) {
    return null;
}

return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-[#FF4500] text-white text-xs font-bold px-4 py-2.5 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center shadow-lg">
    <span>
        Order <strong>#{order.orderNumber}</strong> is not confirmed yet. Send it on WhatsApp to confirm and pay.
    </span>
    <div className="flex items-center gap-2">
        <a
        href={order.whatsAppUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-white text-black px-3 py-1 rounded-sm font-black uppercase tracking-wider hover:bg-neutral-100 transition-colors"
        >
        Continue on WhatsApp
        </a>
        <button
        onClick={() => {
            clearPendingOrder();
            setOrder(null);
        }}
        className="underline cursor-pointer hover:text-neutral-200 text-[11px]"
        >
        I sent it
        </button>
    </div>
    </div>
);
}