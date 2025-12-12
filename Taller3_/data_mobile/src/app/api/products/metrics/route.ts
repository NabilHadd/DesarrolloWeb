// app/api/products/metrics/route.ts
import { productController } from "@/modules/products";

export async function GET(request: Request) {
  return productController.getProductMetrics(request);
}