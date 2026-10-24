'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { authHeaders, clearToken } from '@/lib/auth';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'https://localhost:7114/api/v1';
const PAGE_SIZE = 10;

const STATUS_FILTERS = [
{ value: '', label: 'All Statuses' },
{ value: '1', label: 'Draft' },
{ value: '2', label: 'Active' },
{ value: '3', label: 'Out of Stock' },
{ value: '4', label: 'Archived' },
];

const BADGE_STYLES: Record<string, { label: string; className: string }> = {
Draft: { label: 'Draft', className: 'bg-neutral-200 text-neutral-700' },
Active: { label: 'Active', className: 'bg-green-100 text-green-700' },
OutOfStock: { label: 'Out of Stock', className: 'bg-red-100 text-red-700' },
Archived: { label: 'Archived', className: 'bg-yellow-100 text-yellow-700' },
};

export default function AdminProductsPage() {
const router = useRouter();

const [products, setProducts] = useState<any[]>([]);
const [categories, setCategories] = useState<any[]>([]);
const [totalCount, setTotalCount] = useState(0);
const [totalPages, setTotalPages] = useState(1);

const [search, setSearch] = useState('');
const [debouncedSearch, setDebouncedSearch] = useState('');
const [categorySlug, setCategorySlug] = useState('');
const [status, setStatus] = useState('');
const [page, setPage] = useState(1);

const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState('');
const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
const [refreshKey, setRefreshKey] = useState(0);

// categories for the filter (public endpoint)
useEffect(() => {
    fetch(`${API}/categories`)
    .then((r) => (r.ok ? r.json() : []))
    .then((data) => setCategories(Array.isArray(data) ? data : data?.items ?? []))
    .catch(() => setCategories([]));
}, []);

// debounce the search so we don't call the API on every keystroke
useEffect(() => {
    const t = setTimeout(() => {
    setDebouncedSearch(search.trim());
    setPage(1);
    }, 400);
    return () => clearTimeout(t);
}, [search]);

// load products from the API whenever a filter changes
useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set('search', debouncedSearch);
    if (categorySlug) params.set('categorySlug', categorySlug);
    if (status) params.set('status', status);
    params.set('sort', 'newest');
    params.set('page', String(page));
    params.set('pageSize', String(PAGE_SIZE));

    const controller = new AbortController();
    setIsLoading(true);
    setError('');

    // token is sent so the API knows this is an admin (shows Draft / Archived too)
    fetch(`${API}/products?${params.toString()}`, {
    headers: authHeaders(),
    signal: controller.signal,
    })
    .then((res) => {
        if (!res.ok) throw new Error(`Failed to load products (${res.status})`);
        return res.json();
    })
    .then((data) => {
        setProducts(data.items ?? []);
        setTotalCount(data.totalCount ?? 0);
        setTotalPages(data.totalPages ?? 1);
    })
    .catch((err) => {
        if (err.name === 'AbortError') return;
        console.error(err);
        setError('Could not load products. Please try again.');
        setProducts([]);
    })
    .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
    });

    return () => controller.abort();
}, [debouncedSearch, categorySlug, status, page, refreshKey]);

const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    setError('');

    try {
    const res = await fetch(`${API}/products/${productId}`, {
        method: 'DELETE',
        headers: authHeaders(),
    });

    if (res.status === 401) {
        clearToken();
        router.push('/login');
        return;
    }
    if (res.status === 403) {
        setError('You do not have permission to delete products.');
        return;
    }
    if (!res.ok) {
        const err = await res.json().catch(() => null);
        setError(err?.errors?.join('\n') ?? 'Failed to delete product.');
        return;
    }

    // reload the current page (go back a page if this was the last item on it)
    if (products.length === 1 && page > 1) setPage(page - 1);
    else setRefreshKey((k) => k + 1);
    } catch (err) {
    console.error('Error deleting product:', err);
    setError('Server connection error.');
    }
};

const getStatusBadge = (statusName: string) => {
    const style = BADGE_STYLES[statusName] ?? BADGE_STYLES.Draft;
    return (
    <span
        className={`${style.className} px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase whitespace-nowrap`}
    >
        {style.label}
    </span>
    );
};

return (
    <AdminLayout>
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
        <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight">Products</h2>
        <p className="text-xs font-semibold text-neutral-400 mt-0.5">Manage your products catalog</p>
        </div>
        <Link
        href="/admin/products/new"
        className="bg-[#FF4500] hover:bg-[#e03d00] text-white text-xs font-black uppercase tracking-wider px-4 py-2.5 rounded transition-colors text-center w-full sm:w-auto"
        >
        + Add Product
        </Link>
    </div>

    {error && (
        <div className="mb-4 whitespace-pre-line rounded border border-red-200 bg-red-50 p-3 text-xs font-bold text-red-700">
        {error}
        </div>
    )}

    <div className="bg-white border border-neutral-200 rounded p-4 shadow-sm mb-6 flex flex-col sm:flex-row flex-wrap gap-4 items-center">
        <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full sm:flex-1 min-w-[200px] border border-neutral-200 p-2 text-xs rounded outline-none focus:border-black"
        />

        <select
        value={categorySlug}
        onChange={(e) => {
            setCategorySlug(e.target.value);
            setPage(1);
        }}
        className="w-full sm:w-auto border border-neutral-200 p-2 text-xs rounded bg-white font-bold outline-none cursor-pointer"
        >
        <option value="">All Categories</option>
        {categories.map((c) => (
            <option key={c.id} value={c.slug}>
            {c.name}
            </option>
        ))}
        </select>

        <select
        value={status}
        onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
        }}
        className="w-full sm:w-auto border border-neutral-200 p-2 text-xs rounded bg-white font-bold outline-none cursor-pointer"
        >
        {STATUS_FILTERS.map((s) => (
            <option key={s.value} value={s.value}>
            {s.label}
            </option>
        ))}
        </select>
    </div>

    <div className="bg-white border border-neutral-200 rounded shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[650px]">
        <thead>
            <tr className="border-b border-neutral-200 text-[11px] font-black uppercase tracking-wider text-neutral-400 bg-neutral-50">
            <th className="p-4">Image</th>
            <th className="p-4">Name</th>
            <th className="p-4">Category</th>
            <th className="p-4">Price</th>
            <th className="p-4">Stock</th>
            <th className="p-4">Status</th>
            <th className="p-4 text-right">Actions</th>
            </tr>
        </thead>

        <tbody className="divide-y divide-neutral-100 text-xs font-semibold">
            {isLoading ? (
            <tr>
                <td colSpan={7} className="p-8 text-center text-neutral-400">
                Loading products...
                </td>
            </tr>
            ) : products.length === 0 ? (
            <tr>
                <td colSpan={7} className="p-8 text-center text-neutral-400">
                No products found.
                </td>
            </tr>
            ) : (
            products.map((product) => {
                const productId = product.id;
                const displayImage = product.thumbnailUrl || '/images/product/Basic.jpg';
                const isMenuOpen = activeDropdown === productId;
                const priceText =
                product.maxPrice > product.minPrice
                    ? `EGP ${product.minPrice} - ${product.maxPrice}`
                    : `EGP ${product.minPrice ?? 0}`;

                return (
                <tr key={productId} className="hover:bg-neutral-50 transition-colors relative">
                    <td className="p-4">
                    <div className="relative w-10 h-12 bg-neutral-100 rounded overflow-hidden shrink-0">
                        <Image
                        src={displayImage}
                        alt={product.name || 'Product'}
                        fill
                        className="object-cover"
                        />
                    </div>
                    </td>

                    <td className="p-4 font-extrabold max-w-[150px] truncate">{product.name}</td>
                    <td className="p-4 text-neutral-500">{product.categoryName || 'Unassigned'}</td>
                    <td className="p-4 font-bold whitespace-nowrap">{priceText}</td>
                    <td className="p-4 text-neutral-500">{product.totalStock ?? '-'}</td>
                    <td className="p-4">{getStatusBadge(product.status)}</td>

                    <td className="p-4 text-right relative">
                    <button
                        onClick={() => setActiveDropdown(isMenuOpen ? null : productId)}
                        className="font-bold text-neutral-400 hover:text-black px-3 py-1 text-sm tracking-widest cursor-pointer inline-block"
                    >
                        ...
                    </button>

                    {isMenuOpen && (
                        <div className="absolute right-10 top-2 w-32 bg-white border border-neutral-200 rounded shadow-xl z-50 py-1 text-left">
                        <Link
                            href={`/admin/products/${productId}`}
                            className="block px-4 py-2 hover:bg-neutral-100 text-neutral-700 font-bold"
                            onClick={() => setActiveDropdown(null)}
                        >
                            Edit
                        </Link>
                        <button
                            onClick={() => {
                            setActiveDropdown(null);
                            handleDelete(productId);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 font-bold cursor-pointer"
                        >
                            Delete
                        </button>
                        </div>
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
        <span>
            {totalCount} products · Page {page} of {totalPages}
        </span>
        <div className="flex gap-2">
            <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 border border-neutral-200 rounded bg-white disabled:text-neutral-300 disabled:cursor-not-allowed cursor-pointer hover:border-black"
            >
            Previous
            </button>
            <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 border border-neutral-200 rounded bg-white disabled:text-neutral-300 disabled:cursor-not-allowed cursor-pointer hover:border-black"
            >
            Next
            </button>
        </div>
        </div>
    )}
    </AdminLayout>
);
}