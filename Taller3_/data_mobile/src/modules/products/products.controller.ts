// productController.ts
import { productService } from "./products.service";

export const productController = {
  async getProducts(filters?: { minPrice?: number; sortBy?: 'price' | 'name' | 'stock'; order?: 'asc' | 'desc' }) {
    const data = await productService.getProducts(filters);
    return data;
  },
  async getProductById(id: number){
    const data = await productService.getProductById(id);
    return data;
  }
};
