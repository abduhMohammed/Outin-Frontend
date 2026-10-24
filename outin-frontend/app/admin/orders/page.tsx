'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { getAdminOrders, getAdminOrderById, updateOrderStatus, AuthError } from '@/services/apiService';
import { clearToken } from '@/lib/auth';

const PAGE_SIZE = 15;

const STATUS_STYLES: Record<string, string> = {
Confirmed: 'bg-blue-50 text-blue-800 border-blue-200',
Processing: 'bg-orange-50 text-[#FF4500] border-orange-200',
Shipped: 'bg-purple-50 text-purple-800 border-purple-200',
Delivered: 'bg-emerald-50 text-emerald-800 border-emerald-200',
Cancelled: 'bg-red-50 text-red-800 border-red-200',
};

const NEXT_STATUSES: Record<string, string[]> = {
Pending: ['Confirmed', 'Cancelled'],
Confirmed: ['Processing', 'Cancelled'],
Processing: ['Shipped', 'Cancelled'],
Shipped: ['Delivered'],
Delivered: [],
Cancelled: [],
};

const waLink = (phone: string) => `https://wa.me/20${phone.replace(/^0/, '')}`;

export default function AdminOrdersPage() {
const router = useRouter();

const [orders, setOrders] = useState<any[]>([]);
const [totalCount, setTotalCount] = useState(0);
const [totalPages, setTotalPages] = useState(1);
const [page, setPage] = useState(1);

const [search, setSearch] = useState('');
const [debouncedSearch, setDebouncedSearch] = useState('');
const [status, setStatus] = useState('');

const [loading, setLoading] = useState(true);
const [updatingId, setUpdatingId] = useState<string | null>(null);
const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);
const [details, setDetails] = useState<any | null>(null);
const [detailsLoading, setDetailsLoading] = useState(false);

const handleError = useCallback(
    (err: unknown, fallback: string) => {
    if (err instanceof AuthError) {
        clearToken();
        router.push('/login');
        return;
    }
    setMessage({ type: 'error', text: fallback });
    },
    [router]
);

const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
    const data = await getAdminOrders({
        status,
        search: debouncedSearch,
        page,
        pageSize: PAGE_SIZE,
    });
    const itemsList = Array.isArray(data) ? data : data.items ?? [];
    setOrders(itemsList);
    setTotalCount(data.totalCount ?? itemsList.length);
    setTotalPages(data.totalPages ?? 1);
    } catch (err) {
    setOrders([]);
    handleError(err, 'Could not load orders.');
    } finally {
    setLoading(false);
    }
}, [status, debouncedSearch, page, handleError]);

useEffect(() => {
    const t = setTimeout(() => {
    setDebouncedSearch(search.trim());
    setPage(1);
    }, 400);
    return () => clearTimeout(t);
}, [search]);

useEffect(() => {
    fetchOrders();
}, [fetchOrders]);

const handleStatusChange = async (orderId: string, newStatus: string) => {
    if (newStatus === 'Cancelled' && !confirm('Cancel this order? Stock will be returned.')) return;
    setUpdatingId(orderId);
    setMessage(null);
    try {
    const error = await updateOrderStatus(orderId, newStatus);
    if (error) {
        setMessage({ type: 'error', text: error });
    } else {
        setMessage({ type: 'ok', text: `Order updated to ${newStatus}.` });
        await fetchOrders();
    }
    } catch (err) {
    handleError(err, 'Could not update the order.');
    } finally {
    setUpdatingId(null);
    }
};

const openDetails = async (id: string) => {
    setDetailsLoading(true);
    setDetails({ loading: true });
    try {
    const orderData = await getAdminOrderById(id);
    setDetails(orderData);
    } catch (err) {
    setDetails(null);
    handleError(err, 'Could not load order details.');
    } finally {
    setDetailsLoading(false);
    }
};

const badge = (s: string) => (
    <span
    className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 border rounded-sm whitespace-nowrap ${
        STATUS_STYLES[s] ?? 'bg-neutral-100 text-neutral-700 border-neutral-200'
    }`}
    >
    {s}
    </span>
);

return (
    <AdminLayout>
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
        <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight">Orders</h2>
        <p className="text-xs font-semibold text-neutral-400 mt-0.5">
            Manage customer orders and track fulfillment status
        </p>
        </div>
        <button
        onClick={fetchOrders}
        className="bg-[#FF4500] hover:bg-[#e03d00] text-white text-xs font-black uppercase tracking-wider px-4 py-2.5 rounded transition-colors w-full sm:w-auto cursor-pointer shadow-xs"
        >
        Refresh Orders
        </button>
    </div>

    {message && (
        <div
        className={`mb-4 whitespace-pre-line rounded border p-3 text-xs font-bold ${
            message.type === 'ok'
            ? 'border-green-200 bg-green-50 text-green-700'
            : 'border-red-200 bg-red-50 text-red-700'
        }`}
        >
        {message.text}
        </div>
    )}

    <div className="bg-white border border-neutral-200 rounded p-4 shadow-sm mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <input
        type="text"
        placeholder="Search by Order #, Customer name, or Phone..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full sm:flex-1 min-w-[200px] border border-neutral-200 p-2.5 text-xs font-bold rounded outline-none focus:border-black bg-[#FAFAFA] placeholder:text-neutral-400 text-black"
        />
        <div className="flex items-center gap-2 w-full sm:w-auto">
        <label className="text-[10px] font-black uppercase tracking-wider text-neutral-600 whitespace-nowrap">
            Filter Status:
        </label>
        <select
            value={status}
            onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
            }}
            className="w-full sm:w-auto border border-neutral-200 p-2.5 text-xs font-bold rounded bg-white text-black outline-none cursor-pointer"
        >
            <option value="">All Statuses</option>
            {Object.keys(STATUS_STYLES).map((s) => (
            <option key={s} value={s}>{s}</option>
            ))}
        </select>
        </div>
    </div>

    <div className="bg-white border border-neutral-200 rounded shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[760px]">
        <thead>
            <tr className="border-b border-neutral-200 text-[11px] font-black uppercase tracking-wider text-neutral-400 bg-neutral-50">
            <th className="p-4">Order #</th>
            <th className="p-4">Customer</th>
            <th className="p-4">Phone</th>
            <th className="p-4">City</th>
            <th className="p-4">Total</th>
            <th className="p-4">Date</th>
            <th className="p-4">Status</th>
            <th className="p-4 text-right">Change Status</th>
            </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100 text-xs font-semibold">
            {loading ? (
            <tr>
                <td colSpan={8} className="p-8 text-center text-neutral-400 font-bold uppercase tracking-wider animate-pulse">
                Loading orders...
                </td>
            </tr>
            ) : orders.length === 0 ? (
            <tr>
                <td colSpan={8} className="p-8 text-center text-neutral-400 font-bold uppercase tracking-wider">
                No orders found
                </td>
            </tr>
            ) : (
            orders.map((ord) => {
                const currentStatus = ord.status || 'Pending';
                const next = NEXT_STATUSES[currentStatus] ?? [];
                return (
                <tr key={ord.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="p-4 font-extrabold text-black">
                    <button
                        onClick={() => openDetails(ord.id)}
                        className="hover:text-[#FF4500] underline underline-offset-2 text-left cursor-pointer"
                    >
                        {ord.orderNumber || ord.id?.substring(0, 8)}
                    </button>
                    </td>
                    <td className="p-4 text-neutral-900">{ord.customerName}</td>
                    <td className="p-4 font-mono text-[11px] text-neutral-700">{ord.phoneNumber}</td>
                    <td className="p-4 text-neutral-900">{ord.city}</td>
                    <td className="p-4 font-black text-black whitespace-nowrap">EGP {ord.totalAmount || ord.total || 0}</td>
                    <td className="p-4 text-neutral-500 whitespace-nowrap">
                    {ord.createdAt ? new Date(ord.createdAt).toLocaleDateString('en-GB') : '-'}
                    </td>
                    <td className="p-4">{badge(currentStatus)}</td>
                    <td className="p-4 text-right">
                    {next.length === 0 ? (
                        <span className="text-neutral-300">-</span>
                    ) : (
                        <select
                        disabled={updatingId === ord.id}
                        value=""
                        onChange={(e) => e.target.value && handleStatusChange(ord.id, e.target.value)}
                        className="border border-neutral-200 p-1.5 text-xs font-bold rounded bg-white text-black cursor-pointer disabled:opacity-50"
                        >
                        <option value="">Move to...</option>
                        {next.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                        </select>
                    )}
                    </td>
                </tr>
                );
            })
            )}
        </tbody>
        </table>
    </div>

    {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 text-xs font-bold text-neutral-500">
        <span>{totalCount} orders · Page {page} of {totalPages}</span>
        <div className="flex gap-2">
            <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 border border-neutral-200 rounded bg-white text-black disabled:text-neutral-300 disabled:cursor-not-allowed cursor-pointer hover:border-black"
            >
            Previous
            </button>
            <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 border border-neutral-200 rounded bg-white text-black disabled:text-neutral-300 disabled:cursor-not-allowed cursor-pointer hover:border-black"
            >
            Next
            </button>
        </div>
        </div>
    )}

    {details && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white max-w-lg w-full p-6 sm:p-8 rounded space-y-5 shadow-xl border border-neutral-200 max-h-[90vh] overflow-y-auto text-black">
            {details.loading || detailsLoading ? (
            <p className="text-xs font-bold text-neutral-400 text-center py-8">Loading...</p>
            ) : (
            <>
                <div className="flex justify-between items-start border-b border-neutral-200 pb-4">
                <div>
                    <span className="text-[10px] font-black uppercase text-[#FF4500]">Order Details</span>
                    <h3 className="text-lg font-black uppercase text-neutral-900">{details.orderNumber || details.id}</h3>
                    <div className="mt-1">{badge(details.status)}</div>
                </div>
                <button
                    onClick={() => setDetails(null)}
                    className="text-neutral-400 hover:text-black font-black text-lg px-2 cursor-pointer"
                    aria-label="Close"
                >
                    ✕
                </button>
                </div>

                <div className="space-y-3 text-xs font-bold text-neutral-700 bg-[#FAFAFA] p-4 border border-neutral-200 rounded">
                <p><span className="text-neutral-400 uppercase text-[10px] block">Customer</span>{details.customerName}</p>
                <p>
                    <span className="text-neutral-400 uppercase text-[10px] block">Phone</span>
                    {details.phoneNumber}{' '}
                    {details.phoneNumber && (
                    <a
                        href={waLink(details.phoneNumber)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 text-green-700 underline"
                    >
                        WhatsApp
                    </a>
                    )}
                </p>
                <p><span className="text-neutral-400 uppercase text-[10px] block">City & Address</span>{details.city} - {details.address}</p>
                {details.notes && (
                    <p><span className="text-neutral-400 uppercase text-[10px] block">Notes</span>{details.notes}</p>
                )}
                <p>
                    <span className="text-neutral-400 uppercase text-[10px] block">Created</span>
                    {details.createdAt ? new Date(details.createdAt).toLocaleString('en-GB') : '-'}
                </p>
                </div>

                <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider border-b border-neutral-200 pb-2">
                    Items ({details.items?.length ?? 0})
                </h4>
                {details.items?.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between gap-3 text-xs font-bold border-b border-neutral-100 pb-2">
                    <span>
                        {item.productName || item.name}
                        <span className="block text-[10px] text-neutral-400 font-semibold">
                        {item.colorName} / {item.sizeName} · {item.sku} · x{item.quantity}
                        </span>
                    </span>
                    <span className="font-black whitespace-nowrap text-black">
                        EGP {item.lineTotal || (item.unitPrice ? item.unitPrice * item.quantity : (item.price * item.quantity || 0))}
                    </span>
                    </div>
                ))}
                </div>

                <div className="space-y-1 border-t border-neutral-200 pt-4 text-xs font-bold">
                <div className="flex justify-between"><span>Subtotal</span><span>EGP {details.subTotal || details.total}</span></div>
                <div className="flex justify-between"><span>Delivery</span><span>EGP {details.deliveryFee || 0}</span></div>
                <div className="flex justify-between text-sm font-black text-black">
                    <span>Total</span>
                    <span className="text-[#FF4500]">EGP {details.totalAmount || details.total}</span>
                </div>
                </div>

                <button
                onClick={() => setDetails(null)}
                className="w-full bg-black text-white py-3 text-xs font-black uppercase tracking-widest rounded hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                Close
                </button>
            </>
            )}
        </div>
        </div>
    )}
    </AdminLayout>
);
}