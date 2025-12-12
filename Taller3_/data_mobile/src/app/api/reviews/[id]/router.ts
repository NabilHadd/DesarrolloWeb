import { reviewController } from "@/modules/reviews";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const id_producto = Number(id);
  if (isNaN(id_producto)) {
    return new Response(JSON.stringify({ error: "ID inválido" }), { status: 400 });
  }

  try {
    const reviews = await reviewController.getReviewsByProduct(id_producto);
    return new Response(JSON.stringify(reviews), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 404 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const id_producto = Number(id);
  if (isNaN(id_producto)) {
    return new Response(JSON.stringify({ error: "ID inválido" }), { status: 400 });
  }

  try {
    const body = await request.json();
    const review = await reviewController.createReview({
      id_producto,
      valoracion: body.valoracion,
      descripcion: body.descripcion,
    });

    return new Response(JSON.stringify(review), { status: 201, headers: { "Content-Type": "application/json" } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string; fecha: string }> }
) {
  const { id, fecha } = await params;
  const id_producto = Number(id);
  const fechaDate = new Date(fecha);

  if (isNaN(id_producto) || isNaN(fechaDate.getTime())) {
    return new Response(JSON.stringify({ error: "ID o fecha inválida" }), { status: 400 });
  }

  try {
    const body = await request.json();
    const updated = await reviewController.updateReview(id_producto, fechaDate, {
      valoracion: body.valoracion,
      descripcion: body.descripcion,
    });

    return new Response(JSON.stringify(updated), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; fecha: string }> }
) {
  const { id, fecha } = await params;
  const id_producto = Number(id);
  const fechaDate = new Date(fecha);

  if (isNaN(id_producto) || isNaN(fechaDate.getTime())) {
    return new Response(JSON.stringify({ error: "ID o fecha inválida" }), { status: 400 });
  }

  try {
    const deleted = await reviewController.deleteReview(id_producto, fechaDate);
    return new Response(JSON.stringify(deleted), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400 });
  }
}
