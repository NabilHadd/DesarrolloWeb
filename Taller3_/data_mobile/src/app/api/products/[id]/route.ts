// app/api/products/[id]/route.ts
import { productController } from "@/modules/products";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // params es ahora una Promise
) {
  const resolvedParams = await params; // desbloqueamos la promesa
  const id = Number(resolvedParams.id);

  if (isNaN(id)) {
    return new Response(JSON.stringify({ error: "ID inválido" }), { status: 400 });
  }

  try {
    const data = await productController.getProductById(id);
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 404 });
  }
}
