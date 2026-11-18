'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import { authHeaders, clearToken } from '@/lib/auth';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'https://localhost:7114/api/v1';

const STATUS_OPTIONS = [
{ value: 1, label: 'Draft' },
{ value: 2, label: 'Active (Published)' },
{ value: 4, label: 'Archived' },
];

const MAX_FILE_BYTES = 5 * 1024 * 1024;

const buildSku = (prodName: string, colorName: string, sizeName: string) => {
const clean = (s: string) => s.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
const p =
    prodName
    .trim()
    .split(/\s+/)
    .map((w) => clean(w).slice(0, 3))
    .join('')
    .slice(0, 9) || 'PRD';
const c = clean(colorName).slice(0, 4) || 'CLR';
const s = clean(sizeName) || 'SZ';
return `${p}-${c}-${s}`;
};

type VariantEdit = { sku?: string; price?: string; stock?: string };

export default function AddProductPage() {
const router = useRouter();

const [name, setName] = useState('');
const [description, setDescription] = useState('');
const [status, setStatus] = useState<number>(2);
const [categoryId, setCategoryId] = useState('');
const [basePrice, setBasePrice] = useState<number | ''>('');

const [categories, setCategories] = useState<any[]>([]);
const [availableColors, setAvailableColors] = useState<any[]>([]);
const [availableSizes, setAvailableSizes] = useState<any[]>([]);
const [selectedColors, setSelectedColors] = useState<any[]>([]);
const [selectedSizes, setSelectedSizes] = useState<any[]>([]);

const [imageUrls, setImageUrls] = useState<string[]>([]);
const [isUploading, setIsUploading] = useState(false);

const [edits, setEdits] = useState<Record<string, VariantEdit>>({});

const [isSubmitting, setIsSubmitting] = useState(false);
const [error, setError] = useState('');

const toList = (data: any) => {
    if (Array.isArray(data)) return data;
    return data?.data || data?.items || [];
};

const handleAuthError = (res: Response) => {
    if (res.status === 401) {
    clearToken();
    router.push('/login');
    return true;
    }
    if (res.status === 403) {
    setError('You do not have permission.');
    return true;
    }
    return false;
};

useEffect(() => {
    const safeFetch = async (endpoint: string, setter: (data: any[]) => void) => {
    try {
        const res = await fetch(`${API}/${endpoint}`);
        if (!res.ok) {
        console.warn(`Fetch ${endpoint} returned status: ${res.status}`);
        setter([]);
        return;
        }
        setter(toList(await res.json()));
    } catch (err) {
        console.error(`Error fetching ${endpoint}:`, err);
        setter([]);
    }
    };

    safeFetch('categories', setCategories);
    safeFetch('colors', setAvailableColors);
    safeFetch('sizes', setAvailableSizes);
}, []);

const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = '';
    if (files.length === 0) return;

    const tooBig = files.find((f) => f.size > MAX_FILE_BYTES);
    if (tooBig) {
    setError(`${tooBig.name} exceeds 5MB limit`);
    return;
    }

    setError('');
    setIsUploading(true);

    const formData = new FormData();
    files.forEach((f) => formData.append('files', f));

    try {
    const res = await fetch(`${API}/products/images?folder=products`, {
        method: 'POST',
        headers: authHeaders(),
        body: formData,
    });

    if (handleAuthError(res)) return;

    if (!res.ok) {
        const err = await res.json().catch(() => null);
        setError(err?.errors?.join('\n') ?? 'Failed to upload image.');
        return;
    }

    const data = await res.json();
    setImageUrls((prev) => [...prev, ...data.urls]);
    } catch (err) {
    console.error('Error uploading image:', err);
    setError('Connection error while uploading image.');
    } finally {
    setIsUploading(false);
    }
};

const removeImage = (index: number) =>
    setImageUrls((prev) => prev.filter((_, i) => i !== index));

const variantRows = useMemo(() => {
    const rows: any[] = [];
    selectedColors.forEach((c) => {
    selectedSizes.forEach((s) => {
        const colorId = c.id || c.colorId;
        const sizeId = s.id || s.sizeId;
        const colorName = c.name || c.colorName;
        const sizeName = s.name || s.sizeName;

        const key = `${colorId}-${sizeId}`;
        const e = edits[key] ?? {};
        rows.push({
        key,
        colorId,
        sizeId,
        colorName,
        sizeName,
        sku: e.sku ?? buildSku(name, colorName, sizeName),
        price: e.price ?? (basePrice === '' ? '' : String(basePrice)),
        stock: e.stock ?? '',
        });
    });
    });
    return rows;
}, [selectedColors, selectedSizes, edits, name, basePrice]);

const updateEdit = (key: string, patch: VariantEdit) =>
    setEdits((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));

const toggle = (list: any[], setList: (v: any[]) => void, item: any) => {
    const itemId = item.id || item.colorId || item.sizeId;
    const exists = list.some((x) => (x.id || x.colorId || x.sizeId) === itemId);
    setList(
    exists
        ? list.filter((x) => (x.id || x.colorId || x.sizeId) !== itemId)
        : [...list, item]
    );
};

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (variantRows.length === 0) {
    setError('Select at least one color and one size.');
    return;
    }

    for (const r of variantRows) {
    if (!r.sku.trim()) return setError(`SKU is empty for ${r.colorName}/${r.sizeName}`);
    if (!(Number(r.price) > 0))
        return setError(`Price must be greater than 0 for ${r.colorName}/${r.sizeName}`);
    if (r.stock === '' || Number(r.stock) < 0)
        return setError(`Stock is required for ${r.colorName}/${r.sizeName}`);
    }

    const skus = variantRows.map((r) => r.sku.trim().toUpperCase());
    if (new Set(skus).size !== skus.length) {
    setError('Duplicate SKU found. Each variant must have a unique SKU.');
    return;
    }

    const payload = {
    name,
    description: description || null,
    status: Number(status),
    categoryId,
    imageUrls,
    facultyDropIds: [], // legacy field, still required by the API until the backend cleanup
    variants: variantRows.map((r) => ({
        sku: r.sku.trim(),
        colorId: r.colorId,
        sizeId: r.sizeId,
        price: Number(r.price),
        stockQuantity: Number(r.stock),
    })),
    };

    setIsSubmitting(true);
    try {
    const res = await fetch(`${API}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(payload),
    });

    if (res.ok) {
        router.push('/admin/products');
        return;
    }

    if (handleAuthError(res)) return;

    const err = await res.json().catch(() => null);
    setError(err?.errors?.join('\n') ?? 'Failed to save product.');
    } catch (err) {
    console.error('Error adding product:', err);
    setError('Server connection error.');
    } finally {
    setIsSubmitting(false);
    }
};

return (
    <AdminLayout>
    <div className="p-8 overflow-y-auto">
        <div className="mb-6">
        <Link
            href="/admin/products"
            className="text-xs font-bold text-neutral-400 hover:text-black uppercase tracking-wider mb-2 inline-block transition-colors"
        >
            ← Back to Products
        </Link>
        <h2 className="text-2xl font-black uppercase tracking-tight">Add Product</h2>
        <p className="text-xs font-semibold text-neutral-400 mt-0.5">Fill in the product details</p>
        </div>

        {error && (
        <div className="mb-6 whitespace-pre-line rounded border border-red-200 bg-red-50 p-3 text-xs font-bold text-red-700">
            {error}
        </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6 bg-white border border-neutral-200 p-6 rounded shadow-sm">
            <div>
            <label className="text-xs font-bold uppercase tracking-wider block mb-1">
                Product Name <span className="text-[#FF4500]">*</span>
            </label>
            <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Outin Signature Hoodie"
                className="w-full border border-neutral-200 p-2.5 text-xs font-bold rounded outline-none focus:border-black"
            />
            </div>

            <div>
            <label className="text-xs font-bold uppercase tracking-wider block mb-1">
                Category <span className="text-[#FF4500]">*</span>
            </label>
            <select
                required
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full border border-neutral-200 p-2.5 text-xs font-bold rounded bg-white outline-none focus:border-black cursor-pointer"
            >
                <option value="">Select category</option>
                {categories.map((cat) => (
                <option key={cat.id || cat.categoryId} value={cat.id || cat.categoryId}>
                    {cat.name}
                </option>
                ))}
            </select>
            </div>

            <div>
            <label className="text-xs font-bold uppercase tracking-wider block mb-1">
                Status <span className="text-[#FF4500]">*</span>
            </label>
            <select
                value={status}
                onChange={(e) => setStatus(Number(e.target.value))}
                className="w-full border border-neutral-200 p-2.5 text-xs font-bold rounded bg-white outline-none focus:border-black cursor-pointer"
            >
                {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                    {o.label}
                </option>
                ))}
            </select>
            </div>

            <div>
            <label className="text-xs font-bold uppercase tracking-wider block mb-1">
                Base Price (EGP) <span className="text-[#FF4500]">*</span>
            </label>
            <input
                type="number"
                required
                min={1}
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="e.g. 899"
                className="w-full border border-neutral-200 p-2.5 text-xs font-bold rounded outline-none focus:border-black"
            />
            </div>

            <div>
            <label className="text-xs font-bold uppercase tracking-wider block mb-1">Description</label>
            <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Product details..."
                className="w-full border border-neutral-200 p-2.5 text-xs font-semibold rounded outline-none focus:border-black resize-none"
            />
            </div>
        </div>

        <div className="space-y-6">
            <div className="bg-white border border-neutral-200 p-6 rounded shadow-sm">
            <label className="text-xs font-bold uppercase tracking-wider block mb-3">
                Images {imageUrls.length > 0 && `(${imageUrls.length})`}
            </label>

            {imageUrls.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-3">
                {imageUrls.map((url, i) => (
                    <div key={`${url}-${i}`} className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={url}
                        alt=""
                        className="w-full aspect-square object-cover rounded border border-neutral-200"
                    />
                    {i === 0 && (
                        <span className="absolute left-1 top-1 bg-black text-white text-[9px] font-bold px-1 rounded">
                        MAIN
                        </span>
                    )}
                    <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute right-1 top-1 bg-white border border-neutral-300 text-[10px] font-black w-5 h-5 rounded-full leading-none hover:bg-red-50"
                        aria-label="Remove image"
                    >
                        ×
                    </button>
                    </div>
                ))}
                </div>
            )}

            <label className="border-2 border-dashed border-neutral-200 rounded p-6 flex flex-col items-center justify-center cursor-pointer hover:border-black transition-colors bg-neutral-50">
                <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                multiple
                onChange={handleImageUpload}
                disabled={isUploading}
                className="hidden"
                />
                <svg className="w-8 h-8 text-neutral-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
                </svg>
                <span className="text-xs font-bold">{isUploading ? 'Uploading...' : 'Upload images'}</span>
                <span className="text-[10px] text-neutral-400 mt-0.5">PNG, JPG, WEBP (max 5MB each)</span>
            </label>
            </div>

            <div className="bg-white border border-neutral-200 p-6 rounded shadow-sm space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider block">
                Colors <span className="text-[#FF4500]">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
                {availableColors.length > 0 ? (
                availableColors.map((c) => {
                    const cId = c.id || c.colorId;
                    const cName = c.name || c.colorName;
                    const isSelected = selectedColors.some((x) => (x.id || x.colorId) === cId);
                    return (
                    <button
                        type="button"
                        key={cId}
                        onClick={() => toggle(selectedColors, setSelectedColors, c)}
                        className={`px-3 py-1.5 text-xs font-bold rounded border transition-colors ${
                        isSelected
                            ? 'bg-black text-white border-black'
                            : 'bg-white text-neutral-700 border-neutral-200 hover:border-black'
                        }`}
                    >
                        {cName}
                    </button>
                    );
                })
                ) : (
                <span className="text-xs text-neutral-400">Loading colors...</span>
                )}
            </div>
            </div>

            <div className="bg-white border border-neutral-200 p-6 rounded shadow-sm space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider block">
                Sizes <span className="text-[#FF4500]">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
                {availableSizes.length > 0 ? (
                availableSizes.map((s) => {
                    const sId = s.id || s.sizeId;
                    const sName = s.name || s.sizeName;
                    const isSelected = selectedSizes.some((x) => (x.id || x.sizeId) === sId);
                    return (
                    <button
                        type="button"
                        key={sId}
                        onClick={() => toggle(selectedSizes, setSelectedSizes, s)}
                        className={`px-3 py-1.5 text-xs font-bold rounded border transition-colors ${
                        isSelected
                            ? 'bg-black text-white border-black'
                            : 'bg-white text-neutral-700 border-neutral-200 hover:border-black'
                        }`}
                    >
                        {sName}
                    </button>
                    );
                })
                ) : (
                <span className="text-xs text-neutral-400">Loading sizes...</span>
                )}
            </div>
            </div>
        </div>

        {variantRows.length > 0 && (
            <div className="lg:col-span-3 bg-white border border-neutral-200 p-6 rounded shadow-sm">
            <label className="text-xs font-bold uppercase tracking-wider block mb-3">
                Variants ({variantRows.length})
            </label>
            <div className="overflow-x-auto">
                <table className="w-full text-xs">
                <thead>
                    <tr className="text-left text-neutral-400 uppercase tracking-wider">
                    <th className="py-2 pr-3">Color</th>
                    <th className="py-2 pr-3">Size</th>
                    <th className="py-2 pr-3">SKU</th>
                    <th className="py-2 pr-3">Price (EGP)</th>
                    <th className="py-2">Stock</th>
                    </tr>
                </thead>
                <tbody>
                    {variantRows.map((r) => (
                    <tr key={r.key} className="border-t border-neutral-100">
                        <td className="py-2 pr-3 font-bold">{r.colorName}</td>
                        <td className="py-2 pr-3 font-bold">{r.sizeName}</td>
                        <td className="py-2 pr-3">
                        <input
                            value={r.sku}
                            onChange={(e) => updateEdit(r.key, { sku: e.target.value })}
                            className="w-full min-w-[160px] border border-neutral-200 p-2 font-bold rounded outline-none focus:border-black"
                        />
                        </td>
                        <td className="py-2 pr-3">
                        <input
                            type="number"
                            min={1}
                            value={r.price}
                            onChange={(e) => updateEdit(r.key, { price: e.target.value })}
                            className="w-28 border border-neutral-200 p-2 font-bold rounded outline-none focus:border-black"
                        />
                        </td>
                        <td className="py-2">
                        <input
                            type="number"
                            min={0}
                            required
                            value={r.stock}
                            onChange={(e) => updateEdit(r.key, { stock: e.target.value })}
                            placeholder="0"
                            className="w-24 border border-neutral-200 p-2 font-bold rounded outline-none focus:border-black"
                        />
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            </div>
        )}

        <div className="lg:col-span-3">
            <button
            type="submit"
            disabled={isSubmitting || isUploading}
            className="w-full bg-[#FF4500] hover:bg-[#e03d00] text-white text-xs font-black uppercase tracking-widest py-4 rounded transition-colors disabled:bg-neutral-300 disabled:cursor-not-allowed shadow-sm"
            >
            {isSubmitting ? 'Saving Product...' : 'Save Product'}
            </button>
        </div>
        </form>
    </div>
    </AdminLayout>
);
}