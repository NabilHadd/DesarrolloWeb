import { productService } from "./products.service";

export const productController = {
  async getProducts() {
    const data = await productService.getProducts();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  },
};
