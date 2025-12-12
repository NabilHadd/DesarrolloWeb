import { productController } from "@/modules/products";

// GET /api/admin
export async function GET() {
  return await productController.getProducts();
}
