'use client';

import { useState, useEffect, useCallback, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { authHeaders, clearToken } from '@/lib/auth';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'https://localhost:7114/api/v1';
const MAX_FILE_BYTES = 5 * 1024 * 1024;

const STATUS_OPTIONS = [
{ value: 1, label: 'Draft' },
{ value: 2, label: 'Active' },
{ value: 4, label: 'Archived' },
];

// the API returns the status as text; OutOfStock is automatic, so it maps to Active
const STATUS_TO_NUMBER: Record<string, number> = {
Draft: 1,
Active: 2,
OutOfStock: 2,
Archived: 4,
};

type VariantEdit = { price: string; stock: string };

export default function AdminProductDetailEditPage({
params,
}: {
params: Promise<{ id: string }>;
}) {
const { id: productId } = use(params);
const router = useRouter();

const [isLoading, setIsLoading] = useState(true);
const [isSaving, setIsSaving] = useState(false);
const [isUploading, setIsUploading] = useState(false);
const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);

const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 2,
    categoryId: '',
});
const [isOutOfStock, setIsOutOfStock] = useState(false);

const [variants, setVariants] = useState<any[]>([]);
const [variantEdits, setVariantEdits] = useState<Record<string, VariantEdit>>({});
const [images, setImages] = useState<any[]>([]);

const [categories, setCategories] = useState<any[]>([]);
const [colors, setColors] = useState<any[]>([]);
const [sizes, setSizes] = useState<any[]>([]);

const [newVariant, setNewVariant] = useState({
    colorId: '',
    sizeId: '',
    price: '',
    stockQuantity: '',
    sku: '',
});

const toList = (data: any) => (Array.isArray(data) ? data : data?.items ?? []);

// one place for auth: sends the token, and redirects to login on 401
const call = useCallback(
    async (path: string, init: RequestInit = {}) => {
    const isJson = init.body && !(init.body instanceof FormData);
    const res = await fetch(`${API}${path}`, {
        ...init,
        headers: {
        ...(isJson ? { 'Content-Type': 'application/json' } : {}),
        ...authHeaders(),
        ...(init.headers ?? {}),
        },
    });
    if (res.status === 401) {
        clearToken();
        router.push('/login');
        throw new Error('Session expired');
    }
    return res;
    },
    [router]
);

const readError = async (res: Response, fallback: string) => {
    if (res.status === 403) return 'You do not have permission.';
    const err = await res.json().catch(() => null);
    return err?.errors?.join('\n') ?? fallback;
};

const loadVariants = useCallback(async () => {
    const res = await call(`/products/${productId}/variants`);
    if (!res.ok) return;
    const list = toList(await res.json());
    setVariants(list);
    const edits: Record<string, VariantEdit> = {};
    list.forEach((v: any) => {
    edits[v.id] = { price: String(v.price), stock: String(v.stockQuantity) };
    });
    setVariantEdits(edits);
}, [call, productId]);

const loadImages = useCallback(async () => {
    const res = await call(`/products/${productId}/images`);
    if (res.ok) setImages(toList(await res.json()));
}, [call, productId]);

useEffect(() => {
    async function load() {
    try {
        // public lookups: no token needed
        const [cats, cols, szs] = await Promise.all([
        fetch(`${API}/categories`),
        fetch(`${API}/colors`),
        fetch(`${API}/sizes`),
        ]);
        if (cats.ok) setCategories(toList(await cats.json()));
        if (cols.ok) setColors(toList(await cols.json()));
        if (szs.ok) setSizes(toList(await szs.json()));

        const prodRes = await call(`/products/${productId}`);
        if (!prodRes.ok) {
        setMessage({
            type: 'error',
            text:
            prodRes.status === 404
                ? 'Product not found.'
                : await readError(prodRes, 'Failed to load product.'),
        });
        return;
        }
        const p = await prodRes.json();
        setIsOutOfStock(p.productStatus === 'OutOfStock');
        setFormData({
        name: p.name ?? '',
        description: p.description ?? '',
        status: STATUS_TO_NUMBER[p.productStatus] ?? 2,
        categoryId: p.categoryId ?? '',
        });

        await Promise.all([loadVariants(), loadImages()]);
    } catch (err) {
        console.error('Error loading product details:', err);
    } finally {
        setIsLoading(false);
    }
    }
    load();
}, [productId, call, loadVariants, loadImages]);

// ---------- product ----------
const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);
    try {
    const res = await call(`/products/${productId}`, {
        method: 'PUT',
        body: JSON.stringify({
        id: productId,
        name: formData.name,
        description: formData.description || null,
        status: Number(formData.status),
        categoryId: formData.categoryId,
        facultyDropIds: [], // legacy field, still required by the API until the backend cleanup
        }),
    });

    if (res.ok) {
        router.push('/admin/products');
        return;
    }
    setMessage({ type: 'error', text: await readError(res, 'Failed to update product.') });
    } catch (err) {
    console.error(err);
    } finally {
    setIsSaving(false);
    }
};

// ---------- variants ----------
const generateSku = (colorId: string, sizeId: string) => {
    const color = colors.find((c) => c.id === colorId)?.name || 'COL';
    const size = sizes.find((s) => s.id === sizeId)?.name || 'SZ';
    const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
    const prefix = formData.name
    ? formData.name.replace(/[^a-zA-Z0-9]/g, '').substring(0, 3).toUpperCase()
    : 'PRD';
    return `${prefix}-${color.substring(0, 3).toUpperCase()}-${size.toUpperCase()}-${rand}`;
};

const handleColorOrSizeChange = (field: 'colorId' | 'sizeId', value: string) => {
    const updated = { ...newVariant, [field]: value };
    if (updated.colorId && updated.sizeId) updated.sku = generateSku(updated.colorId, updated.sizeId);
    setNewVariant(updated);
};

const handleAddVariant = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    try {
    const res = await call(`/products/${productId}/variants`, {
        method: 'POST',
        body: JSON.stringify({
        colorId: newVariant.colorId,
        sizeId: newVariant.sizeId,
        price: parseFloat(newVariant.price),
        stockQuantity: parseInt(newVariant.stockQuantity),
        sku: newVariant.sku,
        }),
    });
    if (!res.ok) {
        setMessage({ type: 'error', text: await readError(res, 'Failed to add variant.') });
        return;
    }
    setNewVariant({ colorId: '', sizeId: '', price: '', stockQuantity: '', sku: '' });
    setMessage({ type: 'ok', text: 'Variant added.' });
    await loadVariants();
    } catch (err) {
    console.error(err);
    }
};

const handleSaveVariant = async (v: any) => {
    const edit = variantEdits[v.id];
    setMessage(null);
    try {
    const res = await call(`/products/${productId}/variants/${v.id}`, {
        method: 'PUT',
        body: JSON.stringify({
        id: v.id,
        sku: v.sku,
        colorId: v.colorId,
        sizeId: v.sizeId,
        price: parseFloat(edit.price),
        stockQuantity: parseInt(edit.stock),
        }),
    });
    if (!res.ok) {
        setMessage({ type: 'error', text: await readError(res, 'Failed to update variant.') });
        return;
    }
    setMessage({ type: 'ok', text: 'Variant updated.' });
    await loadVariants();
    } catch (err) {
    console.error(err);
    }
};

const handleDeleteVariant = async (variantId: string) => {
    if (!confirm('Are you sure you want to delete this variant?')) return;
    setMessage(null);
    try {
    const res = await call(`/products/${productId}/variants/${variantId}`, { method: 'DELETE' });
    if (!res.ok) {
        setMessage({ type: 'error', text: await readError(res, 'Failed to delete variant.') });
        return;
    }
    await loadVariants();
    } catch (err) {
    console.error(err);
    }
};

// ---------- images ----------
const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = '';
    if (files.length === 0) return;

    const tooBig = files.find((f) => f.size > MAX_FILE_BYTES);
    if (tooBig) {
    setMessage({ type: 'error', text: `${tooBig.name} exceeds 5MB limit` });
    return;
    }

    setMessage(null);
    setIsUploading(true);
    try {
    // 1) upload the files, get back their URLs
    const formDataUpload = new FormData();
    files.forEach((f) => formDataUpload.append('files', f));
    const up = await call(`/products/images?folder=products`, { method: 'POST', body: formDataUpload });
    if (!up.ok) {
        setMessage({ type: 'error', text: await readError(up, 'Failed to upload image.') });
        return;
    }
    const { urls } = await up.json();

    // 2) attach each URL to this product (one by one so the display order stays correct)
    for (const url of urls as string[]) {
        const res = await call(`/products/${productId}/images`, {
        method: 'POST',
        body: JSON.stringify({ imageUrl: url }),
        });
        if (!res.ok) {
        setMessage({ type: 'error', text: await readError(res, 'Failed to attach image.') });
        break;
        }
    }
    await loadImages();
    } catch (err) {
    console.error(err);
    } finally {
    setIsUploading(false);
    }
};

const handleDeleteImage = async (imageId: string) => {
    if (!confirm('Delete this image?')) return;
    setMessage(null);
    try {
    const res = await call(`/products/${productId}/images/${imageId}`, { method: 'DELETE' });
    if (!res.ok) {
        setMessage({ type: 'error', text: await readError(res, 'Failed to delete image.') });
        return;
    }
    await loadImages();
    } catch (err) {
    console.error(err);
    }
};

if (isLoading) {
    return (
    <AdminLayout>
        <div className="flex items-center justify-center h-64 font-sans text-xs font-bold text-neutral-400">
        Loading product details...
        </div>
    </AdminLayout>
    );
}

return (
    <AdminLayout>
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
        <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight">Edit Product</h2>
        <p className="text-xs font-semibold text-neutral-400 mt-0.5">
            Update product details, images, and variants
        </p>
        </div>
        <Link
        href="/admin/products"
        className="text-xs font-bold text-neutral-600 hover:text-black transition-colors"
        >
        &larr; Back to Products
        </Link>
    </div>

    {message && (
        <div
        className={`mb-6 whitespace-pre-line rounded border p-3 text-xs font-bold ${
            message.type === 'ok'
            ? 'border-green-200 bg-green-50 text-green-700'
            : 'border-red-200 bg-red-50 text-red-700'
        }`}
        >
        {message.text}
        </div>
    )}

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* PRODUCT INFO */}
        <div className="bg-white border border-neutral-200 rounded p-4 sm:p-6 shadow-sm lg:col-span-1 self-start">
        <h3 className="text-sm font-black uppercase tracking-wider mb-4">Product Information</h3>
        <form onSubmit={handleUpdateProduct} className="space-y-4">
            <div>
            <label className="block text-xs font-bold text-neutral-600 mb-1">Product Name</label>
            <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border border-neutral-200 p-2 text-xs rounded outline-none focus:border-black font-semibold"
                required
            />
            </div>

            <div>
            <label className="block text-xs font-bold text-neutral-600 mb-1">Description</label>
            <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full border border-neutral-200 p-2 text-xs rounded outline-none focus:border-black font-semibold h-24 resize-none"
            />
            </div>

            <div>
            <label className="block text-xs font-bold text-neutral-600 mb-1">Category</label>
            <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full border border-neutral-200 p-2 text-xs rounded bg-white font-bold outline-none cursor-pointer"
                required
            >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                    {cat.name}
                </option>
                ))}
            </select>
            </div>

            <div>
            <label className="block text-xs font-bold text-neutral-600 mb-1">Status</label>
            <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: parseInt(e.target.value) })}
                className="w-full border border-neutral-200 p-2 text-xs rounded bg-white font-bold outline-none cursor-pointer"
            >
                {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                    {o.label}
                </option>
                ))}
            </select>
            {isOutOfStock && (
                <p className="text-[10px] text-red-600 font-bold mt-1">
                Currently out of stock (automatic). It becomes Active again when stock is added.
                </p>
            )}
            </div>

            <button
            type="submit"
            disabled={isSaving}
            className="w-full bg-black hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-wider py-2.5 rounded transition-colors cursor-pointer disabled:bg-neutral-300"
            >
            {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
        </form>
        </div>

        <div className="lg:col-span-2 space-y-6">
        {/* IMAGES */}
        <div className="bg-white border border-neutral-200 rounded p-4 sm:p-6 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-wider mb-4">
            Images {images.length > 0 && `(${images.length})`}
            </h3>

            {images.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
                {images.map((img, i) => (
                <div
                    key={img.id}
                    className="relative aspect-square bg-neutral-100 rounded overflow-hidden border border-neutral-200"
                >
                    <Image src={img.imageUrl} alt="" fill className="object-cover" />
                    {i === 0 && (
                    <span className="absolute left-1 top-1 bg-black text-white text-[9px] font-bold px-1 rounded">
                        MAIN
                    </span>
                    )}
                    <button
                    type="button"
                    onClick={() => handleDeleteImage(img.id)}
                    className="absolute right-1 top-1 bg-white border border-neutral-300 text-[10px] font-black w-5 h-5 rounded-full leading-none hover:bg-red-50 cursor-pointer"
                    aria-label="Delete image"
                    >
                    ×
                    </button>
                </div>
                ))}
            </div>
            ) : (
            <p className="text-xs text-neutral-400 mb-4">No images yet.</p>
            )}

            <label className="border-2 border-dashed border-neutral-200 rounded p-5 flex flex-col items-center justify-center cursor-pointer hover:border-black transition-colors bg-neutral-50">
            <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                multiple
                onChange={handleImageUpload}
                disabled={isUploading}
                className="hidden"
            />
            <span className="text-xs font-bold">{isUploading ? 'Uploading...' : '+ Add images'}</span>
            <span className="text-[10px] text-neutral-400 mt-0.5">PNG, JPG, WEBP (max 5MB each)</span>
            </label>
        </div>

        {/* VARIANTS */}
        <div className="bg-white border border-neutral-200 rounded p-4 sm:p-6 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-wider mb-4">Product Variants</h3>

            <div className="border border-neutral-200 rounded overflow-x-auto mb-6">
            <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                <tr className="border-b border-neutral-200 text-[11px] font-black uppercase tracking-wider text-neutral-400 bg-neutral-50">
                    <th className="p-3">Color</th>
                    <th className="p-3">Size</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Stock</th>
                    <th className="p-3">SKU</th>
                    <th className="p-3 text-right">Actions</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-xs font-semibold">
                {variants.length === 0 ? (
                    <tr>
                    <td colSpan={6} className="p-6 text-center text-neutral-400">
                        No variants found.
                    </td>
                    </tr>
                ) : (
                    variants.map((v) => {
                    const edit =
                        variantEdits[v.id] ?? { price: String(v.price), stock: String(v.stockQuantity) };
                    const changed =
                        edit.price !== String(v.price) || edit.stock !== String(v.stockQuantity);
                    return (
                        <tr key={v.id} className="hover:bg-neutral-50">
                        <td className="p-3 whitespace-nowrap">{v.colorName}</td>
                        <td className="p-3 whitespace-nowrap">{v.sizeName}</td>
                        <td className="p-3">
                            <input
                            type="number"
                            min={1}
                            value={edit.price}
                            onChange={(e) =>
                                setVariantEdits({
                                ...variantEdits,
                                [v.id]: { ...edit, price: e.target.value },
                                })
                            }
                            className="w-24 border border-neutral-200 p-1.5 rounded outline-none focus:border-black font-bold"
                            />
                        </td>
                        <td className="p-3">
                            <input
                            type="number"
                            min={0}
                            value={edit.stock}
                            onChange={(e) =>
                                setVariantEdits({
                                ...variantEdits,
                                [v.id]: { ...edit, stock: e.target.value },
                                })
                            }
                            className="w-20 border border-neutral-200 p-1.5 rounded outline-none focus:border-black font-bold"
                            />
                        </td>
                        <td className="p-3 text-neutral-500 whitespace-nowrap">{v.sku}</td>
                        <td className="p-3 text-right whitespace-nowrap space-x-3">
                            {changed && (
                            <button
                                onClick={() => handleSaveVariant(v)}
                                className="text-green-700 hover:text-green-900 font-bold cursor-pointer"
                            >
                                Save
                            </button>
                            )}
                            <button
                            onClick={() => handleDeleteVariant(v.id)}
                            className="text-red-600 hover:text-red-800 font-bold cursor-pointer"
                            >
                            Delete
                            </button>
                        </td>
                        </tr>
                    );
                    })
                )}
                </tbody>
            </table>
            </div>

            <h4 className="text-xs font-black uppercase tracking-wider mb-3">Add New Variant</h4>
            <form
            onSubmit={handleAddVariant}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 items-end"
            >
            <div>
                <label className="block text-[11px] font-bold text-neutral-600 mb-1">Color</label>
                <select
                value={newVariant.colorId}
                onChange={(e) => handleColorOrSizeChange('colorId', e.target.value)}
                className="w-full border border-neutral-200 p-2 text-xs rounded bg-white font-bold outline-none cursor-pointer"
                required
                >
                <option value="">Select Color</option>
                {colors.map((c) => (
                    <option key={c.id} value={c.id}>
                    {c.name}
                    </option>
                ))}
                </select>
            </div>

            <div>
                <label className="block text-[11px] font-bold text-neutral-600 mb-1">Size</label>
                <select
                value={newVariant.sizeId}
                onChange={(e) => handleColorOrSizeChange('sizeId', e.target.value)}
                className="w-full border border-neutral-200 p-2 text-xs rounded bg-white font-bold outline-none cursor-pointer"
                required
                >
                <option value="">Select Size</option>
                {sizes.map((s) => (
                    <option key={s.id} value={s.id}>
                    {s.name}
                    </option>
                ))}
                </select>
            </div>

            <div>
                <label className="block text-[11px] font-bold text-neutral-600 mb-1">Price</label>
                <input
                type="number"
                min={1}
                placeholder="Price"
                value={newVariant.price}
                onChange={(e) => setNewVariant({ ...newVariant, price: e.target.value })}
                className="w-full border border-neutral-200 p-2 text-xs rounded outline-none focus:border-black font-semibold"
                required
                />
            </div>

            <div>
                <label className="block text-[11px] font-bold text-neutral-600 mb-1">Stock</label>
                <input
                type="number"
                min={0}
                placeholder="Stock"
                value={newVariant.stockQuantity}
                onChange={(e) => setNewVariant({ ...newVariant, stockQuantity: e.target.value })}
                className="w-full border border-neutral-200 p-2 text-xs rounded outline-none focus:border-black font-semibold"
                required
                />
            </div>

            <div>
                <label className="block text-[11px] font-bold text-neutral-600 mb-1">SKU (Auto)</label>
                <input
                type="text"
                value={newVariant.sku}
                readOnly
                placeholder="Auto-generated"
                className="w-full border border-neutral-200 bg-neutral-100 p-2 text-xs rounded outline-none font-semibold text-neutral-500 cursor-not-allowed"
                required
                />
            </div>

            <div className="sm:col-span-2 lg:col-span-1">
                <button
                type="submit"
                className="w-full bg-[#FF4500] hover:bg-[#e03d00] text-white text-xs font-black uppercase tracking-wider py-2 rounded transition-colors h-[34px] cursor-pointer"
                >
                + Add Variant
                </button>
            </div>
            </form>
        </div>
        </div>
    </div>
    </AdminLayout>
);
}