import { Category, Color, Product, ProductDetails, Size } from "@/types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7114/api/v1";

// Resolve relative API image paths to full URLs or return the fallback image
const getValidImageUrl = (url?: string, fallback = "/images/Product/Basic.jpg"): string => {
if (!url || url.trim() === "" || url === "string") return fallback;

if (!url.startsWith("http://") && !url.startsWith("https://") && !url.startsWith("/")) {
    return `${API_BASE_URL.replace("/api/v1", "")}/${url}`;
}
return url;
};

// Normalize API responses into an array regardless of pagination wrapper shape
const extractArray = <T>(json: any): T[] => {
if (Array.isArray(json)) return json;
if (Array.isArray(json?.items)) return json.items;
if (Array.isArray(json?.data)) return json.data;
return [];
};

// Retrieve authToken (or fallback token) from browser storage for authenticated requests
const getAuthHeaders = () => {
const token =
    typeof window !== "undefined"
    ? localStorage.getItem("authToken") || localStorage.getItem("token")
    : null;

return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
};
};

// In-flight request cache to prevent duplicate concurrent GET calls
const requestCache = new Map<string, Promise<any>>();
const IS_SERVER = typeof window === "undefined";
const SERVER_REVALIDATE_SECONDS = 300;

async function fetchWithDeduplication<T>(endpoint: string): Promise<T> {
const url = `${API_BASE_URL}/${endpoint}`;

if (requestCache.has(url)) {
    return requestCache.get(url)!;
}

const promise = (async () => {
    try {
    const res = await fetch(
        url,
        IS_SERVER ? { next: { revalidate: SERVER_REVALIDATE_SECONDS } } : { cache: "no-store" }
    );
    if (!res.ok) {
        if (IS_SERVER) throw new Error(`GET ${endpoint} failed (${res.status})`);
        return [] as unknown as T;
    }
    return await res.json();
    } catch (error) {
    if (IS_SERVER) throw error; // keeps the last good cached page instead of caching an empty one
    console.error(`Error fetching ${endpoint}:`, error);
    return [] as unknown as T;
    } finally {
    setTimeout(() => requestCache.delete(url), 5000);
    }
})();

requestCache.set(url, promise);
return promise;
}

// Fetch active product categories
export async function getCategories(): Promise<Category[]> {
const json = await fetchWithDeduplication<any>("categories");
const categoriesArray = extractArray<Category>(json);
return categoriesArray.filter((cat) => cat.isActive);
}

// Fetch all products with resolved thumbnail URLs
export async function getProducts(): Promise<Product[]> {
const json = await fetchWithDeduplication<any>("products");
const productsArray = extractArray<Product>(json);

return productsArray.map((prod) => ({
    ...prod,
    thumbnailUrl: getValidImageUrl(prod.thumbnailUrl, "/images/product/Basic.jpg"),
}));
}

// Fetch available product colors
export async function getColors(): Promise<Color[]> {
const json = await fetchWithDeduplication<any>("colors");
return extractArray<Color>(json);
}

// Fetch available product sizes
export async function getSizes(): Promise<Size[]> {
const json = await fetchWithDeduplication<any>("sizes");
return extractArray<Size>(json);
}

// Fetch single product details by ID
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

// Fetch single product details by slug (public customer endpoint)
export async function getProductBySlug(slug: string): Promise<ProductDetails | null> {
try {
    const res = await fetch(
    `${API_BASE_URL}/products/${encodeURIComponent(slug)}`,
    IS_SERVER ? { next: { revalidate: 60 } } : { cache: "no-store" }
    );
    if (res.status === 404) return null;
    if (!res.ok) {
    if (IS_SERVER) throw new Error(`GET products/${slug} failed (${res.status})`);
    return null;
    }

    const data: ProductDetails = await res.json();

    return {
    ...data,
    imageUrls:
        data.imageUrls && data.imageUrls.length > 0
        ? data.imageUrls.map((img) => getValidImageUrl(img, "/images/product/Basic.jpg"))
        : ["/images/product/Basic.jpg"],
    };
} catch (error) {
    if (IS_SERVER) throw error;
    console.error("getProductBySlug Error:", error);
    return null;
}
}

// Fetch products from the latest drop
export async function getLatestDropProducts(): Promise<any[]> {
const json = await fetchWithDeduplication<any>("products/latest-drop");
const dropArray = extractArray<any>(json);

return dropArray.map((prod) => ({
    ...prod,
    thumbnailUrl: getValidImageUrl(prod.thumbnailUrl, "/images/product/Basic.jpg"),
}));
}

// Fetch top best-selling products
export async function getBestSellers(take = 8): Promise<Product[]> {
const json = await fetchWithDeduplication<any>(`products/best-sellers?take=${take}`);
const arr = extractArray<Product>(json);

return arr.map((prod) => ({
    ...prod,
    thumbnailUrl: getValidImageUrl(prod.thumbnailUrl, "/images/product/Basic.jpg"),
}));
}

// Custom error class for 401 Unauthorized responses
export class AuthError extends Error {
constructor(message: string) {
    super(message);
    this.name = "AuthError";
}
}

// Fetch paginated and filtered orders for the admin dashboard
export async function getAdminOrders(params?: {
status?: string;
search?: string;
page?: number;
pageSize?: number;
}) {
try {
    const query = new URLSearchParams();
    if (params?.status) query.append("status", params.status);
    if (params?.search) query.append("search", params.search);
    if (params?.page) query.append("page", params.page.toString());
    if (params?.pageSize) query.append("pageSize", params.pageSize.toString());

    const url = `${API_BASE_URL}/admin/orders${query.toString() ? `?${query.toString()}` : ""}`;
    const res = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(),
    cache: "no-store",
    });

    if (res.status === 401) throw new AuthError("Unauthorized");
    if (!res.ok) return { items: [], totalCount: 0, totalPages: 1 };
    return await res.json();
} catch (err) {
    if (err instanceof AuthError) throw err;
    console.error("Error fetching admin orders:", err);
    return { items: [], totalCount: 0, totalPages: 1 };
}
}

// Fetch single order details by ID for the admin dashboard
export async function getAdminOrderById(id: string) {
try {
    const res = await fetch(`${API_BASE_URL}/admin/orders/${id}`, {
    method: "GET",
    headers: getAuthHeaders(),
    cache: "no-store",
    });
    if (res.status === 401) throw new AuthError("Unauthorized");
    if (!res.ok) return null;
    return await res.json();
} catch (err) {
    if (err instanceof AuthError) throw err;
    console.error("Error fetching order details:", err);
    return null;
}
}

// Update order status by ID in the admin dashboard
export async function updateOrderStatus(orderId: string, status: string | number) {
try {
    const res = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/status`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
    });
    if (res.status === 401) throw new AuthError("Unauthorized");
    if (!res.ok) {
    const errText = await res.text();
    return errText || "Failed to update order status";
    }
    return null;
} catch (err) {
    if (err instanceof AuthError) throw err;
    console.error("Error updating order status:", err);
    return "Network error while updating status.";
}
}