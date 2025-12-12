import { productRepository } from "./products.repository";
import { Prisma } from "@prisma/client";
import { FilterState } from "@/lib/features/filterSlice";
import { ProductMetrics } from "./types";

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

    async createProduct(data: Prisma.ProductoCreateInput) {
    // Aquí podrías validar campos, precio > 0, stock >= 0, etc.
    return await productRepository.createProduct(data);
  },

  // Actualizar producto
  async updateProduct(id_producto: number, data: Prisma.ProductoUpdateInput) {
    // Verificar si existe antes de actualizar
    const existing = await productRepository.findById(id_producto);
    if (!existing) throw new Error(`Producto con ID ${id_producto} no existe`);
    return await productRepository.updateProduct(id_producto, data);
  },

  // Eliminar producto
  async deleteProduct(id_producto: number) {
    // Verificar si existe antes de eliminar
    const existing = await productRepository.findById(id_producto);
    if (!existing) throw new Error(`Producto con ID ${id_producto} no existe`);
    return await productRepository.deleteProduct(id_producto);
  },

  async getProductMetrics(filters: Partial<FilterState>): Promise<ProductMetrics> {
    
    // Obtener los IDs de los productos que cumplen el filtro
    const minPrice = filters.minPrice || 0;
    const productIds = await productRepository.getFilteredProductIds(minPrice);
    
    if (productIds.length === 0) {
      return { stockHistory: [], salesByProduct: [] };
    }

    // Ejecutar ambas consultas de métricas en paralelo
    const [stockHistory, salesByProduct] = await Promise.all([
      productRepository.getGlobalStockHistory(productIds),
      productRepository.getSalesQuantityByProduct(productIds),
    ]);
    return { stockHistory, salesByProduct };
  },

};
