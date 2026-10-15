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