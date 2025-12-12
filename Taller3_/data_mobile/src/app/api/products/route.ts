import { productController } from "@/modules/products";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filtersRaw = Object.fromEntries(searchParams.entries());

  const filters = {
    minPrice: filtersRaw.minPrice ? Number(filtersRaw.minPrice) : undefined,
    sortBy: filtersRaw.sortBy as 'price' | 'name' | 'stock' | undefined,
    order: filtersRaw.order as 'asc' | 'desc' | undefined,
  };


  const data = await productController.getProducts(filters);

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
