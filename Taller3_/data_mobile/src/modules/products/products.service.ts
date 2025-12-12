import { productRepository } from "./products.repository";

export const productService = {

  async getProducts() {
    const products = await productRepository.findAll();

    if(!products) throw new Error("Productos no encontrados.");
    

    return products;
  },
};
