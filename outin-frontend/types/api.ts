// 1. Category
export interface Category {
id: string;
name: string;
slug: string;
description: string;
isActive: boolean;
}

// 2. Product (list item)
export interface Product {
id: string;
name: string;
slug: string;
minPrice: number;
maxPrice: number;
thumbnailUrl: string;
categoryName?: string;
totalStock?: number;
status?: string; // "Draft" | "Active" | "OutOfStock" | "Archived"
}

// 3. Color
export interface Color {
id: string;
name: string;
hexCode?: string;
}

// 4. Size
export interface Size {
id: string;
name: string;
}

// 5. Product variant
export interface ProductVariant {
id: string;
sku: string;
colorId: string;
colorName: string;
colorHexCode?: string;
sizeId: string;
sizeName: string;
price: number;
stockQuantity: number;
}

// 6. Product details
export interface ProductDetails {
id: string;
name: string;
slug: string;
description: string;
productStatus: string;
categoryId: string;
categoryName: string;
variants: ProductVariant[];
imageUrls: string[];
}

// 7. Cart item (stored in the browser)
export interface CartItem {
variantId: string;
productId: string;
slug: string;
name: string;
imageUrl: string;
colorName: string;
sizeName: string;
price: number;
quantity: number;
maxStock: number;
}

// 8. Result of POST /orders
export interface CreateOrderResult {
orderId: string;
orderNumber: string;
total: number;
whatsAppUrl: string;
}