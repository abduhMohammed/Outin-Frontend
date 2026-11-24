'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { authHeaders, clearToken } from '@/lib/auth';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'https://localhost:7114/api/v1';

type Summary = { orders: number; revenue: number };
type Dashboard = {
today: Summary;
month: Summary;
pendingOrders: number;
last7Days: { date: string; orders: number; revenue: number }[];
lowStock: { productId: string; productName: string; color: string; size: string; stock: number }[];
topProducts: { name: string; unitsSold: number; revenue: number }[];
recentOrders: {
    id: string;
    orderNumber: string;
    customerName: string;
    total: number;
    status: string;
    createdAt: string;
}[];
};

const money = (n: number) => `EGP ${Math.round(n).toLocaleString()}`;

// the API sends UTC without a "Z"; add it so the browser converts to Cairo time correctly
const asUtc = (s: string) => new Date(/[zZ]$|[+-]\d\d:\d\d$/.test(s) ? s : `${s}Z`);

const statusStyle: Record<string, string> = {
Pending: 'bg-yellow-100 text-yellow-800',
Confirmed: 'bg-blue-100 text-blue-800',
Processing: 'bg-indigo-100 text-indigo-800',
Shipped: 'bg-purple-100 text-purple-800',
Delivered: 'bg-green-100 text-green-800',
Cancelled: 'bg-neutral-200 text-neutral-600',
};

function StatCard({ label, value, hint, accent }: { label: string; value: string; hint?: string; accent?: boolean }) {
return (
    <div className={`bg-white border rounded p-4 shadow-sm ${accent ? 'border-[#FF4500]' : 'border-neutral-200'}`}>
    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{label}</p>
    <p className={`text-xl sm:text-2xl font-black mt-1 ${accent ? 'text-[#FF4500]' : 'text-black'}`}>{value}</p>
    {hint && <p className="text-[11px] font-semibold text-neutral-400 mt-0.5">{hint}</p>}
    </div>
);
}

export default function AdminDashboardPage() {
const router = useRouter();
const [data, setData] = useState<Dashboard | null>(null);
const [error, setError] = useState('');
const [loading, setLoading] = useState(true);

const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
    const res = await fetch(`${API}/admin/dashboard`, { headers: authHeaders(), cache: 'no-store' });
    if (res.status === 401) {
        clearToken();
        router.push('/login');
        return;
    }
    if (!res.ok) {
        setError(res.status === 403 ? 'You do not have permission.' : 'Could not load the dashboard.');
        return;
    }
    setData(await res.json());
    } catch (err) {
    console.error(err);
    setError('Could not reach the server.');
    } finally {
    setLoading(false);
    }
}, [router]);

useEffect(() => {
    load();
}, [load]);

if (loading && !data) {
    return (
    <AdminLayout>
        <div className="flex items-center justify-center h-64 text-xs font-bold text-neutral-400">
        Loading dashboard...
        </div>
    </AdminLayout>
    );
}

if (!data) {
    return (
    <AdminLayout>
        <div className="rounded border border-red-200 bg-red-50 p-4 text-xs font-bold text-red-700">
        {error || 'No data.'}
        </div>
    </AdminLayout>
    );
}

const maxRevenue = Math.max(...data.last7Days.map((d) => d.revenue), 1);
const weekRevenue = data.last7Days.reduce((s, d) => s + d.revenue, 0);

return (
    <AdminLayout>
    <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight">Dashboard</h2>
        <button
        onClick={load}
        disabled={loading}
        className="text-xs font-bold border border-neutral-300 bg-white px-3 py-1.5 rounded cursor-pointer hover:border-black disabled:opacity-50"
        >
        {loading ? 'Refreshing...' : 'Refresh'}
        </button>
    </div>

    {/* CARDS */}
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        <StatCard label="Orders today" value={String(data.today.orders)} />
        <StatCard label="Revenue today" value={money(data.today.revenue)} />
        <StatCard label="Orders this month" value={String(data.month.orders)} />
        <StatCard label="Revenue this month" value={money(data.month.revenue)} />
        <Link href="/admin/orders" className="block col-span-2 lg:col-span-1">
        <StatCard
            label="Pending orders"
            value={String(data.pendingOrders)}
            hint={data.pendingOrders > 0 ? 'Need confirmation' : 'All handled'}
            accent={data.pendingOrders > 0}
        />
        </Link>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* 7 DAY CHART */}
        <div className="lg:col-span-2 bg-white border border-neutral-200 rounded p-4 sm:p-6 shadow-sm">
        <div className="flex items-baseline justify-between mb-4">
            <h3 className="text-sm font-black uppercase tracking-wider">Last 7 days</h3>
            <span className="text-xs font-bold text-neutral-500">{money(weekRevenue)}</span>
        </div>
        <div className="flex items-end gap-2 sm:gap-3 h-48">
            {data.last7Days.map((d) => {
            const pct = (d.revenue / maxRevenue) * 100;
            const label = new Date(`${d.date}T00:00:00Z`).toLocaleDateString('en-GB', {
                weekday: 'short',
                day: 'numeric',
                timeZone: 'UTC',
            });
            return (
                <div
                key={d.date}
                className="flex-1 flex flex-col items-center justify-end h-full min-w-0"
                title={`${label}: ${money(d.revenue)}, ${d.orders} order(s)`}
                >
                <span className="text-[10px] font-bold text-neutral-500 mb-1 truncate max-w-full">
                    {d.revenue > 0 ? Math.round(d.revenue).toLocaleString() : ''}
                </span>
                <div
                    className={`w-full rounded-t ${d.revenue > 0 ? 'bg-[#FF4500]' : 'bg-neutral-200'}`}
                    style={{ height: `${d.revenue > 0 ? Math.max(pct, 3) : 2}%` }}
                />
                <span className="text-[10px] font-bold text-neutral-400 mt-2 whitespace-nowrap">{label}</span>
                </div>
            );
            })}
        </div>
        </div>

        {/* TOP PRODUCTS */}
        <div className="bg-white border border-neutral-200 rounded p-4 sm:p-6 shadow-sm">
        <h3 className="text-sm font-black uppercase tracking-wider mb-1">Top products</h3>
        <p className="text-[11px] font-semibold text-neutral-400 mb-3">Last 30 days, by units sold</p>
        {data.topProducts.length === 0 ? (
            <p className="text-xs font-bold text-neutral-400">No sales yet.</p>
        ) : (
            <ol className="space-y-3">
            {data.topProducts.map((p, i) => (
                <li key={p.name} className="flex items-center gap-3 text-xs">
                <span className="w-5 h-5 shrink-0 rounded-full bg-black text-white text-[10px] font-black flex items-center justify-center">
                    {i + 1}
                </span>
                <span className="flex-1 min-w-0 font-bold truncate">{p.name}</span>
                <span className="text-right whitespace-nowrap">
                    <span className="block font-black">{p.unitsSold} sold</span>
                    <span className="block text-[10px] text-neutral-400">{money(p.revenue)}</span>
                </span>
                </li>
            ))}
            </ol>
        )}
        </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LOW STOCK */}
        <div className="bg-white border border-neutral-200 rounded p-4 sm:p-6 shadow-sm">
        <h3 className="text-sm font-black uppercase tracking-wider mb-1">Low stock</h3>
        <p className="text-[11px] font-semibold text-neutral-400 mb-3">5 pieces or fewer</p>
        {data.lowStock.length === 0 ? (
            <p className="text-xs font-bold text-green-600">Everything is well stocked.</p>
        ) : (
            <ul className="divide-y divide-neutral-100">
            {data.lowStock.map((v, i) => (
                <li key={`${v.productId}-${v.color}-${v.size}-${i}`}>
                <Link
                    href={`/admin/products/${v.productId}`}
                    className="flex items-center gap-3 py-2.5 text-xs hover:bg-neutral-50"
                >
                    <span className="flex-1 min-w-0">
                    <span className="block font-black truncate">{v.productName}</span>
                    <span className="block text-[10px] text-neutral-400">
                        {v.color} / {v.size}
                    </span>
                    </span>
                    <span
                    className={`px-2 py-0.5 rounded text-[10px] font-black ${
                        v.stock === 0 ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-800'
                    }`}
                    >
                    {v.stock === 0 ? 'Sold out' : `${v.stock} left`}
                    </span>
                </Link>
                </li>
            ))}
            </ul>
        )}
        </div>

        {/* RECENT ORDERS */}
        <div className="bg-white border border-neutral-200 rounded p-4 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-black uppercase tracking-wider">Recent orders</h3>
            <Link href="/admin/orders" className="text-xs font-bold text-[#FF4500] hover:underline">
            View all
            </Link>
        </div>
        {data.recentOrders.length === 0 ? (
            <p className="text-xs font-bold text-neutral-400">No orders yet.</p>
        ) : (
            <ul className="divide-y divide-neutral-100">
            {data.recentOrders.map((o) => (
                <li key={o.id} className="flex items-center gap-3 py-2.5 text-xs">
                <span className="flex-1 min-w-0">
                    <span className="block font-black truncate">{o.orderNumber}</span>
                    <span className="block text-[10px] text-neutral-400 truncate">
                    {o.customerName} &middot;{' '}
                    {asUtc(o.createdAt).toLocaleString('en-GB', {
                        timeZone: 'Africa/Cairo',
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                    </span>
                </span>
                <span className="font-black whitespace-nowrap">{money(o.total)}</span>
                <span
                    className={`px-2 py-0.5 rounded text-[10px] font-black ${
                    statusStyle[o.status] ?? 'bg-neutral-100 text-neutral-600'
                    }`}
                >
                    {o.status}
                </span>
                </li>
            ))}
            </ul>
        )}
        </div>
    </div>
    </AdminLayout>
);
}