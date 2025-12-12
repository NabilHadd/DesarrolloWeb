// productController.ts
import { productService } from "./products.service";
import { Prisma } from "@prisma/client";
import { FilterState } from "@/lib/features/filterSlice";

export const productController = {

  async getProducts(filters?: { minPrice?: number; sortBy?: 'price' | 'name' | 'stock'; order?: 'asc' | 'desc' }) {
    return await productService.getProducts(filters);
  },

  async getProductById(id: number) {
    return await productService.getProductById(id);
  },

  async createProduct(data: Prisma.ProductoCreateInput) {
    return await productService.createProduct(data);
  },

  async updateProduct(id: number, data: Prisma.ProductoUpdateInput) {
    return await productService.updateProduct(id, data);
  },

  async deleteProduct(id: number) {
    return await productService.deleteProduct(id);
  },

  async getProductMetrics(req: Request) {
    const url = new URL(req.url);
    
    // extraer los query parameters (filtros)
    const filters: Partial<FilterState> = {
      minPrice: Number(url.searchParams.get('minPrice')) || 0,
    };

    try {
      const data = await productService.getProductMetrics(filters);
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
       console.error("Error in getProductMetrics:", error);
       return new Response(JSON.stringify({ message: "Error interno al obtener métricas." }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },

};
