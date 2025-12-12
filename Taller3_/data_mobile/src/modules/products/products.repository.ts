import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

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
      include: {
        reseñas: true,
        detalleCompras: true,
        historial: true,
      }
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

  createProduct(data: Prisma.ProductoCreateInput) {
    return prisma.producto.create({
      data,
    });
  },

  updateProduct(id_producto: number, data: Prisma.ProductoUpdateInput) {
    return prisma.producto.update({
      where: { id_producto },
      data,
    });
  },

  deleteProduct(id_producto: number) {
    return prisma.producto.delete({
      where: { id_producto },
      include: {
        reseñas: true,
        detalleCompras: true,
        historial: true,
      },
    });
  },

};
