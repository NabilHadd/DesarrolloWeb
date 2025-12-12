import { prisma } from "@/lib/prisma";

export const productRepository = {
  findAll(filters?: { minPrice?: number; sortBy?: 'price' | 'name' | 'stock'; order?: 'asc' | 'desc' }) {
    const { minPrice = 0, sortBy = 'name', order = 'asc' } = filters || {};

    const orderField: Record<string, string> = {
      price: "precio",
      name: "nombre",
      stock: "stock",
    };

    return prisma.producto.findMany({
      where: {
        precio: { gte: minPrice },
      },
      orderBy: {
        [orderField[sortBy]]: order,
      },
    });
  },


  findById(id_producto: number) {
    return prisma.producto.findFirst({
      where: { id_producto },
      include: {
        reseñas: true,
        detalleCompras: true,
        historial: true,
      },
    });
  },
};
