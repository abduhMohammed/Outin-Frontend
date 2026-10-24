'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { authHeaders, clearToken } from '@/lib/auth';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'https://localhost:7114/api/v1';

// Types
interface Category {
id: string;
name: string;
slug: string;
description?: string;
isActive: boolean;
}

interface ColorItem {
id: string;
name: string;
hexCode: string;
}

interface SizeItem {
id: string;
name: string;
}

interface FacultyDrop {
id: string;
name: string;
slug: string;
description?: string;
imageUrl?: string;
displayOrder: number;
isActive: boolean;
}

function CatalogContent() {
const router = useRouter();
const searchParams = useSearchParams();
const activeTab = searchParams.get('tab') || 'categories';

// Global UI States
const [loading, setLoading] = useState<boolean>(false);
const [submitting, setSubmitting] = useState<boolean>(false);
const [uploading, setUploading] = useState<boolean>(false);
const [errorMessage, setErrorMessage] = useState<string | null>(null);
const [successMessage, setSuccessMessage] = useState<string | null>(null);
const [openMenuId, setOpenMenuId] = useState<string | null>(null);

// Data States
const [categories, setCategories] = useState<Category[]>([]);
const [colors, setColors] = useState<ColorItem[]>([]);
const [sizes, setSizes] = useState<SizeItem[]>([]);
const [facultyDrops, setFacultyDrops] = useState<FacultyDrop[]>([]);

// Modal State
const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
const [editingItem, setEditingItem] = useState<any | null>(null);

// Form States
const [catName, setCatName] = useState('');
const [catDesc, setCatDesc] = useState('');
const [catActive, setCatActive] = useState(true);

const [colorName, setColorName] = useState('');
const [colorHex, setColorHex] = useState('#000000');

const [sizeName, setSizeName] = useState('');

const [dropName, setDropName] = useState('');
const [dropDesc, setDropDesc] = useState('');
const [dropImage, setDropImage] = useState('');
const [dropOrder, setDropOrder] = useState(0);
const [dropActive, setDropActive] = useState(true);

// Success auto-hide timer
useEffect(() => {
    if (successMessage) {
    const timer = setTimeout(() => setSuccessMessage(null), 3000);
    return () => clearTimeout(timer);
    }
}, [successMessage]);

// Helper: Admin Fetch
const adminFetch = useCallback(
    async (path: string, init?: RequestInit) => {
    const url = `${API}${path}`;
    const baseHeaders = (authHeaders() as Record<string, string>) || {};
    const customHeaders = (init?.headers as Record<string, string>) || {};

    const headers: Record<string, string> = {
        ...baseHeaders,
        ...customHeaders,
    };

    if (init?.body && !(init.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    const res = await fetch(url, { ...init, headers });

    if (res.status === 401) {
        clearToken();
        router.push('/login');
        throw new Error('Unauthorized');
    }

    if (res.status === 403) {
        throw new Error('You do not have permission.');
    }

    if (!res.ok) {
        let errText = 'An error occurred';
        try {
        const errData = await res.json();
        if (errData?.errors && Array.isArray(errData.errors)) {
            errText = errData.errors.join('\n');
        } else if (errData?.title) {
            errText = errData.title;
        }
        } catch {
        errText = `Request failed with status ${res.status}`;
        }
        throw new Error(errText);
    }

    if (res.status === 204) return null;
    return await res.json();
    },
    [router]
);

// Fetch Tab Data
const loadTabData = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
    if (activeTab === 'categories') {
        const data = await adminFetch('/categories?activeOnly=false');
        setCategories(Array.isArray(data) ? data : []);
    } else if (activeTab === 'colors') {
        const data = await adminFetch('/colors');
        setColors(Array.isArray(data) ? data : []);
    } else if (activeTab === 'sizes') {
        const data = await adminFetch('/sizes');
        setSizes(Array.isArray(data) ? data : []);
    } else if (activeTab === 'faculty-drops') {
        const data = await adminFetch('/faculty-drops?activeOnly=false');
        const sorted = (Array.isArray(data) ? data : []).sort(
        (a: FacultyDrop, b: FacultyDrop) => (a.displayOrder || 0) - (b.displayOrder || 0)
        );
        setFacultyDrops(sorted);
    }
    } catch (err: any) {
    if (err.message !== 'Unauthorized') {
        setErrorMessage(err.message || 'Failed to load data');
    }
    } finally {
    setLoading(false);
    }
}, [activeTab, adminFetch]);

useEffect(() => {
    loadTabData();
    setOpenMenuId(null);
}, [loadTabData]);

// Tab Switcher
const handleTabChange = (tabKey: string) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    router.push(`/admin/catalog?tab=${tabKey}`);
};

// Modal Handlers
const handleOpenAddModal = () => {
    setEditingItem(null);
    setCatName('');
    setCatDesc('');
    setCatActive(true);

    setColorName('');
    setColorHex('#000000');

    setSizeName('');

    setDropName('');
    setDropDesc('');
    setDropImage('');
    setDropOrder(0);
    setDropActive(true);

    setIsModalOpen(true);
};

const handleOpenEditModal = (item: any) => {
    setEditingItem(item);
    if (activeTab === 'categories') {
    setCatName(item.name || '');
    setCatDesc(item.description || '');
    setCatActive(!!item.isActive);
    } else if (activeTab === 'colors') {
    setColorName(item.name || '');
    setColorHex(item.hexCode || '#000000');
    } else if (activeTab === 'sizes') {
    setSizeName(item.name || '');
    } else if (activeTab === 'faculty-drops') {
    setDropName(item.name || '');
    setDropDesc(item.description || '');
    setDropImage(item.imageUrl || '');
    setDropOrder(item.displayOrder || 0);
    setDropActive(!!item.isActive);
    }
    setIsModalOpen(true);
    setOpenMenuId(null);
};

const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
};

// Image Upload Handler for Faculty Drops
const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
    setErrorMessage('Image size must be less than 5MB.');
    return;
    }

    const validTypes = ['image/png', 'image/jpeg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
    setErrorMessage('Only PNG, JPG, and WEBP image formats are supported.');
    return;
    }

    setUploading(true);
    setErrorMessage(null);

    const formData = new FormData();
    formData.append('files', file);

    try {
    const res = await adminFetch('/products/images?folder=faculty-drops', {
        method: 'POST',
        body: formData,
    });

    if (res?.urls && res.urls.length > 0) {
        setDropImage(res.urls[0]);
        setSuccessMessage('Image uploaded successfully.');
    } else {
        setErrorMessage('Failed to retrieve uploaded image URL.');
    }
    } catch (err: any) {
    setErrorMessage(err.message || 'Image upload failed.');
    } finally {
    setUploading(false);
    }
};

// Form Submit Handler
const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setSubmitting(true);

    try {
    if (activeTab === 'categories') {
        const payload = {
        ...(editingItem ? { id: editingItem.id } : {}),
        name: catName,
        description: catDesc,
        isActive: catActive,
        };
        if (editingItem) {
        await adminFetch(`/categories/${editingItem.id}`, {
            method: 'PUT',
            body: JSON.stringify(payload),
        });
        setSuccessMessage('Category updated successfully.');
        } else {
        await adminFetch('/categories', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
        setSuccessMessage('Category created successfully.');
        }
    } else if (activeTab === 'colors') {
        if (!/^#[0-9A-Fa-f]{6}$/.test(colorHex)) {
        throw new Error('Hex code must be in format #RRGGBB (e.g. #FF4500).');
        }
        const payload = {
        ...(editingItem ? { id: editingItem.id } : {}),
        name: colorName,
        hexCode: colorHex,
        };
        if (editingItem) {
        await adminFetch(`/colors/${editingItem.id}`, {
            method: 'PUT',
            body: JSON.stringify(payload),
        });
        setSuccessMessage('Color updated successfully.');
        } else {
        await adminFetch('/colors', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
        setSuccessMessage('Color created successfully.');
        }
    } else if (activeTab === 'sizes') {
        const payload = {
        ...(editingItem ? { id: editingItem.id } : {}),
        name: sizeName,
        };
        if (editingItem) {
        await adminFetch(`/sizes/${editingItem.id}`, {
            method: 'PUT',
            body: JSON.stringify(payload),
        });
        setSuccessMessage('Size updated successfully.');
        } else {
        await adminFetch('/sizes', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
        setSuccessMessage('Size created successfully.');
        }
    } else if (activeTab === 'faculty-drops') {
        const payload = {
        ...(editingItem ? { id: editingItem.id } : {}),
        name: dropName,
        description: dropDesc,
        imageUrl: dropImage,
        displayOrder: Number(dropOrder) || 0,
        isActive: dropActive,
        };
        if (editingItem) {
        await adminFetch(`/faculty-drops/${editingItem.id}`, {
            method: 'PUT',
            body: JSON.stringify(payload),
        });
        setSuccessMessage('Faculty drop updated successfully.');
        } else {
        await adminFetch('/faculty-drops', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
        setSuccessMessage('Faculty drop created successfully.');
        }
    }

    handleCloseModal();
    await loadTabData();
    } catch (err: any) {
    if (err.message !== 'Unauthorized') {
        setErrorMessage(err.message || 'Operation failed.');
    }
    } finally {
    setSubmitting(false);
    }
};

// Delete Handler
const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    setErrorMessage(null);
    setSuccessMessage(null);
    setOpenMenuId(null);

    try {
    let endpoint = '';
    if (activeTab === 'categories') endpoint = `/categories/${id}`;
    else if (activeTab === 'colors') endpoint = `/colors/${id}`;
    else if (activeTab === 'sizes') endpoint = `/sizes/${id}`;
    else if (activeTab === 'faculty-drops') endpoint = `/faculty-drops/${id}`;

    await adminFetch(endpoint, { method: 'DELETE' });
    setSuccessMessage('Item deleted successfully.');
    await loadTabData();
    } catch (err: any) {
    if (err.message !== 'Unauthorized') {
        setErrorMessage(err.message || 'Could not delete item.');
    }
    }
};

return (
    <AdminLayout>
    {/* Header */}
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
        <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight">Catalog Settings</h2>
        <p className="text-xs font-semibold text-neutral-400 mt-0.5">
            Manage your store categories, colors, sizes, and faculty drops
        </p>
        </div>
        <button
        onClick={handleOpenAddModal}
        className="bg-[#FF4500] hover:bg-[#e03d00] text-white text-xs font-black uppercase tracking-wider px-5 py-2.5 rounded shadow-xs transition-colors w-full sm:w-auto cursor-pointer"
        >
        + Add {activeTab === 'categories' ? 'Category' : activeTab === 'colors' ? 'Color' : activeTab === 'sizes' ? 'Size' : 'Faculty Drop'}
        </button>
    </div>

    {/* Tabs */}
    <div className="flex border-b border-neutral-200 mb-6 overflow-x-auto">
        {[
        { key: 'categories', label: 'Categories' },
        { key: 'colors', label: 'Colors' },
        { key: 'sizes', label: 'Sizes' },
        { key: 'faculty-drops', label: 'Faculty Drops' },
        ].map((tab) => (
        <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={`px-4 py-3 text-xs font-black uppercase tracking-wider border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
            activeTab === tab.key
                ? 'border-[#FF4500] text-[#FF4500]'
                : 'border-transparent text-neutral-400 hover:text-black'
            }`}
        >
            {tab.label}
        </button>
        ))}
    </div>

    {/* Messages */}
    {errorMessage && (
        <div className="mb-6 whitespace-pre-line rounded border border-red-200 bg-red-50 p-4 text-xs font-bold text-red-700">
        {errorMessage}
        </div>
    )}

    {successMessage && (
        <div className="mb-6 rounded border border-green-200 bg-green-50 p-4 text-xs font-bold text-green-700">
        {successMessage}
        </div>
    )}

    {/* Content Table Container */}
    <div className="bg-white border border-neutral-200 rounded shadow-sm overflow-x-auto min-h-[300px]">
        {loading ? (
        <div className="p-8 text-center text-xs font-bold uppercase tracking-wider text-neutral-400 animate-pulse">
            Loading catalog data...
        </div>
        ) : (
        <>
            {/* CATEGORIES TAB */}
            {activeTab === 'categories' && (
            <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                <tr className="border-b border-neutral-200 text-[11px] font-black uppercase tracking-wider text-neutral-400 bg-neutral-50">
                    <th className="p-4">Name</th>
                    <th className="p-4">Description</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-xs font-semibold">
                {categories.length === 0 ? (
                    <tr>
                    <td colSpan={4} className="p-8 text-center text-neutral-400 font-bold uppercase tracking-wider">
                        No categories found
                    </td>
                    </tr>
                ) : (
                    categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-neutral-50 transition-colors">
                        <td className="p-4">
                        <div className="font-extrabold text-black">{cat.name}</div>
                        <div className="text-[10px] text-neutral-400 font-mono">/{cat.slug}</div>
                        </td>
                        <td className="p-4 text-neutral-600 max-w-xs truncate">{cat.description || '-'}</td>
                        <td className="p-4">
                        <span
                            className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 border rounded-sm ${
                            cat.isActive
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-neutral-100 text-neutral-600 border-neutral-200'
                            }`}
                        >
                            {cat.isActive ? 'Active' : 'Inactive'}
                        </span>
                        </td>
                        <td className="p-4 text-right relative">
                        <button
                            onClick={() => setOpenMenuId(openMenuId === cat.id ? null : cat.id)}
                            className="p-1 font-black text-neutral-400 hover:text-black cursor-pointer text-base"
                        >
                            •••
                        </button>
                        {openMenuId === cat.id && (
                            <div className="absolute right-4 top-10 w-28 bg-white border border-neutral-200 rounded shadow-md z-10 py-1 text-left">
                            <button
                                onClick={() => handleOpenEditModal(cat)}
                                className="w-full px-3 py-1.5 text-xs font-bold text-neutral-700 hover:bg-neutral-100 text-left cursor-pointer"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(cat.id, cat.name)}
                                className="w-full px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 text-left cursor-pointer"
                            >
                                Delete
                            </button>
                            </div>
                        )}
                        </td>
                    </tr>
                    ))
                )}
                </tbody>
            </table>
            )}

            {/* COLORS TAB */}
            {activeTab === 'colors' && (
            <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                <tr className="border-b border-neutral-200 text-[11px] font-black uppercase tracking-wider text-neutral-400 bg-neutral-50">
                    <th className="p-4">Color</th>
                    <th className="p-4">Name</th>
                    <th className="p-4">Hex Code</th>
                    <th className="p-4 text-right">Actions</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-xs font-semibold">
                {colors.length === 0 ? (
                    <tr>
                    <td colSpan={4} className="p-8 text-center text-neutral-400 font-bold uppercase tracking-wider">
                        No colors found
                    </td>
                    </tr>
                ) : (
                    colors.map((c) => (
                    <tr key={c.id} className="hover:bg-neutral-50 transition-colors">
                        <td className="p-4">
                        <div
                            className="w-6 h-6 rounded-full border border-neutral-300 shadow-xs"
                            style={{ backgroundColor: c.hexCode }}
                        />
                        </td>
                        <td className="p-4 font-extrabold text-black">{c.name}</td>
                        <td className="p-4 font-mono text-[11px] text-neutral-600">{c.hexCode}</td>
                        <td className="p-4 text-right relative">
                        <button
                            onClick={() => setOpenMenuId(openMenuId === c.id ? null : c.id)}
                            className="p-1 font-black text-neutral-400 hover:text-black cursor-pointer text-base"
                        >
                            •••
                        </button>
                        {openMenuId === c.id && (
                            <div className="absolute right-4 top-10 w-28 bg-white border border-neutral-200 rounded shadow-md z-10 py-1 text-left">
                            <button
                                onClick={() => handleOpenEditModal(c)}
                                className="w-full px-3 py-1.5 text-xs font-bold text-neutral-700 hover:bg-neutral-100 text-left cursor-pointer"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(c.id, c.name)}
                                className="w-full px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 text-left cursor-pointer"
                            >
                                Delete
                            </button>
                            </div>
                        )}
                        </td>
                    </tr>
                    ))
                )}
                </tbody>
            </table>
            )}

            {/* SIZES TAB */}
            {activeTab === 'sizes' && (
            <table className="w-full text-left border-collapse min-w-[400px]">
                <thead>
                <tr className="border-b border-neutral-200 text-[11px] font-black uppercase tracking-wider text-neutral-400 bg-neutral-50">
                    <th className="p-4">Name</th>
                    <th className="p-4 text-right">Actions</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-xs font-semibold">
                {sizes.length === 0 ? (
                    <tr>
                    <td colSpan={2} className="p-8 text-center text-neutral-400 font-bold uppercase tracking-wider">
                        No sizes found
                    </td>
                    </tr>
                ) : (
                    sizes.map((s) => (
                    <tr key={s.id} className="hover:bg-neutral-50 transition-colors">
                        <td className="p-4 font-black text-black">{s.name}</td>
                        <td className="p-4 text-right relative">
                        <button
                            onClick={() => setOpenMenuId(openMenuId === s.id ? null : s.id)}
                            className="p-1 font-black text-neutral-400 hover:text-black cursor-pointer text-base"
                        >
                            •••
                        </button>
                        {openMenuId === s.id && (
                            <div className="absolute right-4 top-10 w-28 bg-white border border-neutral-200 rounded shadow-md z-10 py-1 text-left">
                            <button
                                onClick={() => handleOpenEditModal(s)}
                                className="w-full px-3 py-1.5 text-xs font-bold text-neutral-700 hover:bg-neutral-100 text-left cursor-pointer"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(s.id, s.name)}
                                className="w-full px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 text-left cursor-pointer"
                            >
                                Delete
                            </button>
                            </div>
                        )}
                        </td>
                    </tr>
                    ))
                )}
                </tbody>
            </table>
            )}

            {/* FACULTY DROPS TAB */}
            {activeTab === 'faculty-drops' && (
            <table className="w-full text-left border-collapse min-w-[650px]">
                <thead>
                <tr className="border-b border-neutral-200 text-[11px] font-black uppercase tracking-wider text-neutral-400 bg-neutral-50">
                    <th className="p-4">Image</th>
                    <th className="p-4">Name</th>
                    <th className="p-4">Display Order</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-xs font-semibold">
                {facultyDrops.length === 0 ? (
                    <tr>
                    <td colSpan={5} className="p-8 text-center text-neutral-400 font-bold uppercase tracking-wider">
                        No faculty drops found
                    </td>
                    </tr>
                ) : (
                    facultyDrops.map((drop) => (
                    <tr key={drop.id} className="hover:bg-neutral-50 transition-colors">
                        <td className="p-4">
                        {drop.imageUrl ? (
                            <img
                            src={drop.imageUrl}
                            alt={drop.name}
                            className="w-10 h-10 object-cover rounded border border-neutral-200"
                            />
                        ) : (
                            <div className="w-10 h-10 bg-neutral-100 border border-neutral-200 rounded flex items-center justify-center text-[10px] text-neutral-400 font-bold">
                            N/A
                            </div>
                        )}
                        </td>
                        <td className="p-4">
                        <div className="font-extrabold text-black">{drop.name}</div>
                        <div className="text-[10px] text-neutral-400 font-mono">/{drop.slug}</div>
                        </td>
                        <td className="p-4 font-mono font-bold text-black">{drop.displayOrder}</td>
                        <td className="p-4">
                        <span
                            className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 border rounded-sm ${
                            drop.isActive
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-neutral-100 text-neutral-600 border-neutral-200'
                            }`}
                        >
                            {drop.isActive ? 'Active' : 'Inactive'}
                        </span>
                        </td>
                        <td className="p-4 text-right relative">
                        <button
                            onClick={() => setOpenMenuId(openMenuId === drop.id ? null : drop.id)}
                            className="p-1 font-black text-neutral-400 hover:text-black cursor-pointer text-base"
                        >
                            •••
                        </button>
                        {openMenuId === drop.id && (
                            <div className="absolute right-4 top-10 w-28 bg-white border border-neutral-200 rounded shadow-md z-10 py-1 text-left">
                            <button
                                onClick={() => handleOpenEditModal(drop)}
                                className="w-full px-3 py-1.5 text-xs font-bold text-neutral-700 hover:bg-neutral-100 text-left cursor-pointer"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(drop.id, drop.name)}
                                className="w-full px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 text-left cursor-pointer"
                            >
                                Delete
                            </button>
                            </div>
                        )}
                        </td>
                    </tr>
                    ))
                )}
                </tbody>
            </table>
            )}
        </>
        )}
    </div>

    {/* Modal for Add / Edit */}
    {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full p-6 sm:p-8 rounded shadow-xl border border-neutral-200 text-black max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-neutral-200 pb-4 mb-5">
            <h3 className="text-base font-black uppercase tracking-tight">
                {editingItem ? 'Edit' : 'Add'}{' '}
                {activeTab === 'categories'
                ? 'Category'
                : activeTab === 'colors'
                ? 'Color'
                : activeTab === 'sizes'
                ? 'Size'
                : 'Faculty Drop'}
            </h3>
            <button
                onClick={handleCloseModal}
                disabled={submitting}
                className="text-neutral-400 hover:text-black font-black text-lg px-2 cursor-pointer disabled:opacity-50"
            >
                ✕
            </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bold">
            {/* CATEGORY FORM */}
            {activeTab === 'categories' && (
                <>
                <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-neutral-600 mb-1">
                    Name *
                    </label>
                    <input
                    type="text"
                    maxLength={150}
                    required
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                    className="w-full border border-neutral-200 p-2.5 rounded bg-[#FAFAFA] text-black outline-none focus:border-black"
                    placeholder="e.g. Hoodies"
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-neutral-600 mb-1">
                    Description
                    </label>
                    <textarea
                    maxLength={1000}
                    rows={3}
                    value={catDesc}
                    onChange={(e) => setCatDesc(e.target.value)}
                    className="w-full border border-neutral-200 p-2.5 rounded bg-[#FAFAFA] text-black outline-none focus:border-black resize-none"
                    placeholder="Category description..."
                    />
                </div>
                <div className="flex items-center gap-2 pt-1">
                    <input
                    type="checkbox"
                    id="catActive"
                    checked={catActive}
                    onChange={(e) => setCatActive(e.target.checked)}
                    className="w-4 h-4 accent-[#FF4500] cursor-pointer"
                    />
                    <label htmlFor="catActive" className="text-xs font-bold text-neutral-800 cursor-pointer">
                    Active
                    </label>
                </div>
                </>
            )}

            {/* COLOR FORM */}
            {activeTab === 'colors' && (
                <>
                <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-neutral-600 mb-1">
                    Name *
                    </label>
                    <input
                    type="text"
                    maxLength={50}
                    required
                    value={colorName}
                    onChange={(e) => setColorName(e.target.value)}
                    className="w-full border border-neutral-200 p-2.5 rounded bg-[#FAFAFA] text-black outline-none focus:border-black"
                    placeholder="e.g. Orange"
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-neutral-600 mb-1">
                    Color Hex Code *
                    </label>
                    <div className="flex items-center gap-3">
                    <input
                        type="color"
                        value={colorHex}
                        onChange={(e) => setColorHex(e.target.value)}
                        className="w-10 h-10 border border-neutral-200 rounded cursor-pointer p-0.5 bg-white"
                    />
                    <input
                        type="text"
                        required
                        maxLength={7}
                        value={colorHex}
                        onChange={(e) => setColorHex(e.target.value)}
                        className="flex-1 border border-neutral-200 p-2.5 rounded bg-[#FAFAFA] text-black font-mono outline-none focus:border-black uppercase"
                        placeholder="#FF4500"
                    />
                    </div>
                </div>
                </>
            )}

            {/* SIZE FORM */}
            {activeTab === 'sizes' && (
                <>
                <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-neutral-600 mb-1">
                    Size Name *
                    </label>
                    <input
                    type="text"
                    maxLength={20}
                    required
                    value={sizeName}
                    onChange={(e) => setSizeName(e.target.value)}
                    className="w-full border border-neutral-200 p-2.5 rounded bg-[#FAFAFA] text-black outline-none focus:border-black"
                    placeholder="e.g. S, M, L, XL"
                    />
                </div>
                </>
            )}

            {/* FACULTY DROP FORM */}
            {activeTab === 'faculty-drops' && (
                <>
                <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-neutral-600 mb-1">
                    Name *
                    </label>
                    <input
                    type="text"
                    maxLength={150}
                    required
                    value={dropName}
                    onChange={(e) => setDropName(e.target.value)}
                    className="w-full border border-neutral-200 p-2.5 rounded bg-[#FAFAFA] text-black outline-none focus:border-black"
                    placeholder="e.g. Engineering 2026"
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-neutral-600 mb-1">
                    Description
                    </label>
                    <textarea
                    maxLength={1000}
                    rows={3}
                    value={dropDesc}
                    onChange={(e) => setDropDesc(e.target.value)}
                    className="w-full border border-neutral-200 p-2.5 rounded bg-[#FAFAFA] text-black outline-none focus:border-black resize-none"
                    placeholder="Faculty drop description..."
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-neutral-600 mb-1">
                    Image
                    </label>
                    {dropImage ? (
                    <div className="flex items-center gap-4 p-2 border border-neutral-200 rounded bg-[#FAFAFA]">
                        <img src={dropImage} alt="Preview" className="w-12 h-12 object-cover rounded border" />
                        <button
                        type="button"
                        onClick={() => setDropImage('')}
                        className="bg-black text-white text-[10px] font-black uppercase px-3 py-1.5 rounded hover:bg-neutral-800 transition-colors cursor-pointer"
                        >
                        Remove / Replace
                        </button>
                    </div>
                    ) : (
                    <input
                        type="file"
                        accept="image/png, image/jpeg, image/webp"
                        disabled={uploading}
                        onChange={handleImageUpload}
                        className="w-full border border-neutral-200 p-2 rounded bg-[#FAFAFA] text-xs file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-black file:text-white cursor-pointer disabled:opacity-50"
                    />
                    )}
                    {uploading && <p className="text-[10px] font-bold text-neutral-400 mt-1 animate-pulse">Uploading image...</p>}
                </div>
                <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-neutral-600 mb-1">
                    Display Order
                    </label>
                    <input
                    type="number"
                    min={0}
                    value={dropOrder}
                    onChange={(e) => setDropOrder(parseInt(e.target.value) || 0)}
                    className="w-full border border-neutral-200 p-2.5 rounded bg-[#FAFAFA] text-black outline-none focus:border-black"
                    />
                </div>
                <div className="flex items-center gap-2 pt-1">
                    <input
                    type="checkbox"
                    id="dropActive"
                    checked={dropActive}
                    onChange={(e) => setDropActive(e.target.checked)}
                    className="w-4 h-4 accent-[#FF4500] cursor-pointer"
                    />
                    <label htmlFor="dropActive" className="text-xs font-bold text-neutral-800 cursor-pointer">
                    Active
                    </label>
                </div>
                </>
            )}

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 pt-4">
                <button
                type="submit"
                disabled={submitting || uploading}
                className="bg-[#FF4500] hover:bg-[#e03d00] text-white text-xs font-black uppercase tracking-wider py-3 px-5 rounded transition-colors flex-1 cursor-pointer disabled:opacity-50"
                >
                {submitting ? 'Saving...' : editingItem ? 'Update' : 'Save'}
                </button>
                <button
                type="button"
                onClick={handleCloseModal}
                disabled={submitting}
                className="bg-black text-white text-xs font-black uppercase tracking-wider py-3 px-5 rounded hover:bg-neutral-800 transition-colors cursor-pointer disabled:opacity-50"
                >
                Cancel
                </button>
            </div>
            </form>
        </div>
        </div>
    )}
    </AdminLayout>
);
}

export default function AdminCatalogPage() {
return (
    <Suspense
    fallback={
        <AdminLayout>
        <div className="p-8 text-center text-xs font-bold uppercase tracking-wider text-neutral-400 animate-pulse">
            Loading catalog page...
        </div>
        </AdminLayout>
    }
    >
    <CatalogContent />
    </Suspense>
);
}