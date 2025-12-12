import { productRepository } from "./products.repository";

export const productService = {
  async getProducts(filters?: { minPrice?: number; sortBy?: 'price' | 'name' | 'stock'; order?: 'asc' | 'desc' }) {
    const products =  await productRepository.findAll(filters);
    if(!products) throw new Error("");
    return products;
    
  },


  async getProductById(id_producto: number) {
    const product = await productRepository.findById(id_producto);
    if (!product) throw new Error("No se encontró el producto");
    return product;
  },
};
