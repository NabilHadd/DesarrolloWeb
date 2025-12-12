// productController.ts
import { productService } from "./products.service";
import { Prisma } from "@prisma/client";

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

};
