'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout'; 

export default function AdminProductDetailEditPage({ params }: { params: Promise<{ id: string }> }) {
const resolvedParams = use(params);
const productId = resolvedParams.id;
const router = useRouter();

const [isLoading, setIsLoading] = useState(true);
const [isSaving, setIsSaving] = useState(false);

const [formData, setFormData] = useState({
name: '',
description: '',
status: 1,
categoryId: '',
});

const [variants, setVariants] = useState<any[]>([]);
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

useEffect(() => {
async function loadProductData() {
    try {
    const token = localStorage.getItem('token');
    const headers = { ...(token ? { Authorization: `Bearer ${token}` } : {}) };

    const [prodRes, varRes, catRes, colRes, sizeRes] = await Promise.all([
        fetch(`https://localhost:7114/api/v1/products/${productId}`, { headers }),
        fetch(`https://localhost:7114/api/v1/products/${productId}/variants`, { headers }),
        fetch(`https://localhost:7114/api/v1/categories`, { headers }),
        fetch(`https://localhost:7114/api/v1/colors`, { headers }),
        fetch(`https://localhost:7114/api/v1/sizes`, { headers }),
    ]);

    if (prodRes.ok) {
        const prodData = await prodRes.json();
        setFormData({
        name: prodData.name || '',
        description: prodData.description || '',
        status: prodData.status !== undefined ? prodData.status : 1,
        categoryId: prodData.categoryId || '',
        });
    }

    if (varRes.ok) {
        const varData = await varRes.json();
        setVariants(Array.isArray(varData) ? varData : varData.items || []);
    }

    if (catRes.ok) {
        const catData = await catRes.json();
        setCategories(Array.isArray(catData) ? catData : catData.items || []);
    }

    if (colRes.ok) {
        const colData = await colRes.json();
        setColors(Array.isArray(colData) ? colData : colData.items || []);
    }

    if (sizeRes.ok) {
        const sizeData = await sizeRes.json();
        setSizes(Array.isArray(sizeData) ? sizeData : sizeData.items || []);
    }
    } catch (err) {
    console.error('Error loading product details:', err);
    } finally {
    setIsLoading(false);
    }
}

loadProductData();
}, [productId]);

const generateSku = (colorId: string, sizeId: string) => {
const selectedColor = colors.find((c) => c.id === colorId)?.name || 'COL';
const selectedSize = sizes.find((s) => s.id === sizeId)?.name || 'SZ';
const randomCode = Math.random().toString(36).substring(2, 7).toUpperCase();
const productNamePrefix = formData.name ? formData.name.substring(0, 3).toUpperCase() : 'PRD';
return `${productNamePrefix}-${selectedColor.substring(0, 3).toUpperCase()}-${selectedSize.toUpperCase()}-${randomCode}`;
};

const handleColorOrSizeChange = (field: 'colorId' | 'sizeId', value: string) => {
const updatedVariant = { ...newVariant, [field]: value };
if (updatedVariant.colorId && updatedVariant.sizeId) {
    updatedVariant.sku = generateSku(updatedVariant.colorId, updatedVariant.sizeId);
}
setNewVariant(updatedVariant);
};

const handleUpdateProduct = async (e: React.FormEvent) => {
e.preventDefault();
setIsSaving(true);
try {
    const token = localStorage.getItem('token');
    const payload = {
    id: productId,
    name: formData.name,
    description: formData.description,
    status: Number(formData.status),
    categoryId: formData.categoryId,
    };

    const res = await fetch(`https://localhost:7114/api/v1/products/${productId}`, {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
    });

    if (res.ok) {
    alert('Product updated successfully.');
    router.push('/admin/products');
    } else {
    const errData = await res.json().catch(() => null);
    alert(errData?.message || 'Failed to update product.');
    }
} catch (err) {
    console.error('Error updating product:', err);
} finally {
    setIsSaving(false);
}
};

const handleAddVariant = async (e: React.FormEvent) => {
e.preventDefault();
try {
    const token = localStorage.getItem('token');
    const res = await fetch(`https://localhost:7114/api/v1/products/${productId}/variants`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
        colorId: newVariant.colorId,
        sizeId: newVariant.sizeId,
        price: parseFloat(newVariant.price),
        stockQuantity: parseInt(newVariant.stockQuantity),
        sku: newVariant.sku,
    }),
    });

    if (res.ok) {
    alert('Variant added successfully.');
    window.location.reload();
    } else {
    alert('Failed to add variant.');
    }
} catch (err) {
    console.error('Error adding variant:', err);
}
};

const handleDeleteVariant = async (variantId: string) => {
if (!confirm('Are you sure you want to delete this variant?')) return;
try {
    const token = localStorage.getItem('token');
    const res = await fetch(`https://localhost:7114/api/v1/products/${productId}/variants/${variantId}`, {
    method: 'DELETE',
    headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    });

    if (res.ok) {
    setVariants(variants.filter((v) => v.id !== variantId));
    alert('Variant deleted successfully.');
    } else {
    alert('Failed to delete variant.');
    }
} catch (err) {
    console.error('Error deleting variant:', err);
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
        <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight">Edit Product & Variants</h2>
        <p className="text-xs font-semibold text-neutral-400 mt-0.5">Update product details and manage variants</p>
    </div>
    <Link href="/admin/products" className="text-xs font-bold text-neutral-600 hover:text-black transition-colors">
        &larr; Back to Products
    </Link>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    {/* Product Info Card */}
    <div className="bg-white border border-neutral-200 rounded p-4 sm:p-6 shadow-sm lg:col-span-1">
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
            >
            <option value="">Select Category</option>
            {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
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
            <option value={1}>Active</option>
            <option value={0}>Draft</option>
            </select>
        </div>

        <button
            type="submit"
            disabled={isSaving}
            className="w-full bg-black hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-wider py-2.5 rounded transition-colors cursor-pointer"
        >
            {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
        </form>
    </div>

    {/* Variants Card */}
    <div className="bg-white border border-neutral-200 rounded p-4 sm:p-6 shadow-sm lg:col-span-2 space-y-6">
        <div>
        <h3 className="text-sm font-black uppercase tracking-wider mb-4">Product Variants</h3>
        
        {/* Responsive Table wrapper */}
        <div className="border border-neutral-200 rounded overflow-x-auto mb-6">
            <table className="w-full text-left border-collapse min-w-[500px]">
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
                    <td colSpan={6} className="p-6 text-center text-neutral-400">No variants found.</td>
                </tr>
                ) : (
                variants.map((v) => (
                    <tr key={v.id} className="hover:bg-neutral-50">
                    <td className="p-3 whitespace-nowrap">{v.colorName || 'N/A'}</td>
                    <td className="p-3 whitespace-nowrap">{v.sizeName || 'N/A'}</td>
                    <td className="p-3 whitespace-nowrap">EGP {v.price}</td>
                    <td className="p-3 whitespace-nowrap">
                        {v.stockQuantity !== undefined ? v.stockQuantity : v.stock !== undefined ? v.stock : v.quantity !== undefined ? v.quantity : '0'}
                    </td>
                    <td className="p-3 text-neutral-500 whitespace-nowrap">{v.sku}</td>
                    <td className="p-3 text-right whitespace-nowrap">
                        <button
                        onClick={() => handleDeleteVariant(v.id)}
                        className="text-red-600 hover:text-red-800 font-bold cursor-pointer"
                        >
                        Delete
                        </button>
                    </td>
                    </tr>
                ))
                )}
            </tbody>
            </table>
        </div>

        {/* Add Variant Form - Grid auto adjusts on mobile */}
        <h4 className="text-xs font-black uppercase tracking-wider mb-3">Add New Variant</h4>
        <form onSubmit={handleAddVariant} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 items-end">
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
                <option key={c.id} value={c.id}>{c.name}</option>
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
                <option key={s.id} value={s.id}>{s.name}</option>
                ))}
            </select>
            </div>

            <div>
            <label className="block text-[11px] font-bold text-neutral-600 mb-1">Price</label>
            <input
                type="number"
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