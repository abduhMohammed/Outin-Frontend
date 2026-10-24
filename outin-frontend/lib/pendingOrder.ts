const KEY = 'outin_pending_order';
// keep in sync with the backend auto-cancel window for Pending orders
const MAX_AGE_MS = 24 * 60 * 60 * 1000;

export type PendingOrder = {
orderNumber: string;
whatsAppUrl: string;
createdAt: number;
};

export const savePendingOrder = (orderNumber: string, whatsAppUrl: string) => {
try {
    const data: PendingOrder = { orderNumber, whatsAppUrl, createdAt: Date.now() };
    localStorage.setItem(KEY, JSON.stringify(data));
} catch {}
};

export const getPendingOrder = (): PendingOrder | null => {
try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as PendingOrder;
    if (Date.now() - data.createdAt > MAX_AGE_MS) {
    localStorage.removeItem(KEY);
    return null;
    }
    return data;
} catch {
    return null;
}
};

export const clearPendingOrder = () => {
try {
    localStorage.removeItem(KEY);
} catch {}
};