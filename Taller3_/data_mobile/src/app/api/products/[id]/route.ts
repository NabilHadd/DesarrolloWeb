// app/api/products/[id]/route.ts
import { productController } from "@/modules/products";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const productId = Number(id);
  if (isNaN(productId)) {
    return new Response(JSON.stringify({ error: "ID inválido" }), { status: 400 });
  }

  try {
    const data = await productController.getProductById(productId);
    return new Response(JSON.stringify(data), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 404 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const productId = Number(id);
  if (isNaN(productId)) {
    return new Response(JSON.stringify({ error: "ID inválido" }), { status: 400 });
  }

  try {
    const body = await request.json();
    const updated = await productController.updateProduct(productId, body);
    return new Response(JSON.stringify(updated), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const productId = Number(id);
  if (isNaN(productId)) {
    return new Response(JSON.stringify({ error: "ID inválido" }), { status: 400 });
  }

  try {
    const deleted = await productController.deleteProduct(productId);
    return new Response(JSON.stringify(deleted), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400 });
  }
}
