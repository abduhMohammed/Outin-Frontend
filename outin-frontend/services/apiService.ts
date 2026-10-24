import { Category, Color, FacultyDrop, Product, ProductDetails, Size } from "@/types/api";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7114/api/v1";

const getValidImageUrl = (url?: string, fallback = "/images/Product/Basic.jpg"): string => {
if (!url || url.trim() === "" || url === "string") return fallback;

if (!url.startsWith("http://") && !url.startsWith("https://") && !url.startsWith("/")) {
    return `${API_BASE_URL.replace("/api/v1", "")}/${url}`;
}
return url;
};

const extractArray = <T>(json: any): T[] => {
if (Array.isArray(json)) return json;
if (Array.isArray(json?.items)) return json.items;
if (Array.isArray(json?.data)) return json.data;
return [];
};

// التعديل هنا: جلب authToken (اللي متخزن في المتصفح عندك) بجانب token احتياطياً
const getAuthHeaders = () => {
const token = typeof window !== 'undefined' 
    ? localStorage.getItem('authToken') || localStorage.getItem('token') 
    : null;
    
return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
};
};

const requestCache = new Map<string, Promise<any>>();

async function fetchWithDeduplication<T>(endpoint: string): Promise<T> {
const url = `${API_BASE_URL}/${endpoint}`;

if (requestCache.has(url)) {
    return requestCache.get(url)!;
}

const promise = (async () => {
    try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return [] as unknown as T;
    return await res.json();
    } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return [] as unknown as T;
    } finally {
    setTimeout(() => requestCache.delete(url), 5000);
    }
})();

requestCache.set(url, promise);
return promise;
}

export async function getCategories(): Promise<Category[]> {
const json = await fetchWithDeduplication<any>("categories");
const categoriesArray = extractArray<Category>(json);
return categoriesArray.filter((cat) => cat.isActive);
}

export async function getFacultyDrops(): Promise<FacultyDrop[]> {
const json = await fetchWithDeduplication<any>("faculty-drops");
const facultyArray = extractArray<FacultyDrop>(json);

return facultyArray
    .filter((drop) => drop.isActive)
    .map((drop) => ({
    ...drop,
    imageUrl: getValidImageUrl(drop.imageUrl, "/images/Product/Basic.jpg"),
    }))
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
}

export async function getProducts(): Promise<Product[]> {
const json = await fetchWithDeduplication<any>("products");
const productsArray = extractArray<Product>(json);

return productsArray.map((prod) => ({
    ...prod,
    thumbnailUrl: getValidImageUrl(prod.thumbnailUrl, "/images/product/Basic.jpg"),
}));
}

export async function getColors(): Promise<Color[]> {
const json = await fetchWithDeduplication<any>("colors");
return extractArray<Color>(json);
}

export async function getSizes(): Promise<Size[]> {
const json = await fetchWithDeduplication<any>("sizes");
return extractArray<Size>(json);
}

export async function getProductById(id: string): Promise<ProductDetails | null> {
try {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, { cache: "no-store" });
    if (!res.ok) return null;

    const data: ProductDetails = await res.json();

    return {
    ...data,
    imageUrls:
        data.imageUrls && data.imageUrls.length > 0
        ? data.imageUrls.map((img) => getValidImageUrl(img, "/images/product/Basic.jpg"))
        : ["/images/product/Basic.jpg"],
    };
} catch (error) {
    console.error("getProductById Error:", error);
    return null;
}
}

export async function getLatestDropProducts(): Promise<any[]> {
const json = await fetchWithDeduplication<any>("products/latest-drop");
const dropArray = extractArray<any>(json);

return dropArray.map((prod) => ({
    ...prod,
    thumbnailUrl: getValidImageUrl(prod.thumbnailUrl, "/images/product/Basic.jpg"),
}));
}

export class AuthError extends Error {
constructor(message: string) {
    super(message);
    this.name = 'AuthError';
}
}

export async function getAdminOrders(params?: { status?: string; search?: string; page?: number; pageSize?: number }) {
try {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.search) query.append('search', params.search);
    if (params?.page) query.append('page', params.page.toString());
    if (params?.pageSize) query.append('pageSize', params.pageSize.toString());

    const url = `${API_BASE_URL}/admin/orders${query.toString() ? `?${query.toString()}` : ''}`;
    const res = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
    cache: 'no-store',
    });

    if (res.status === 401) throw new AuthError('Unauthorized');
    if (!res.ok) return { items: [], totalCount: 0, totalPages: 1 };
    return await res.json();
} catch (err) {
    if (err instanceof AuthError) throw err;
    console.error('Error fetching admin orders:', err);
    return { items: [], totalCount: 0, totalPages: 1 };
}
}

export async function getAdminOrderById(id: string) {
try {
    const res = await fetch(`${API_BASE_URL}/admin/orders/${id}`, {
    method: 'GET',
    headers: getAuthHeaders(),
    cache: 'no-store',
    });
    if (res.status === 401) throw new AuthError('Unauthorized');
    if (!res.ok) return null;
    return await res.json();
} catch (err) {
    if (err instanceof AuthError) throw err;
    console.error('Error fetching order details:', err);
    return null;
}
}

export async function updateOrderStatus(orderId: string, status: string | number) {
try {
    const res = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
    });
    if (res.status === 401) throw new AuthError('Unauthorized');
    if (!res.ok) {
    const errText = await res.text();
    return errText || 'Failed to update order status';
    }
    return null;
} catch (err) {
    if (err instanceof AuthError) throw err;
    console.error('Error updating order status:', err);
    return 'Network error while updating status.';
}
}