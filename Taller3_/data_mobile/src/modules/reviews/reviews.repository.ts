import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const reviewRepository = {
  
  findManyByProduct(id_producto: number) {
    return prisma.reseñaProducto.findMany({
      where: { id_producto },
      orderBy: { fecha: "desc" },
    });
  },

  findById(id_producto: number, fecha: Date) {
    return prisma.reseñaProducto.findUnique({
      where: { id_producto_fecha: { id_producto, fecha } },
    });
  },

  create(data: Prisma.ReseñaProductoCreateInput) {
    return prisma.reseñaProducto.create({ data });
  },

  update(id_producto: number, fecha: Date, data: Prisma.ReseñaProductoUpdateInput) {
    return prisma.reseñaProducto.update({
      where: { id_producto_fecha: { id_producto, fecha } },
      data,
    });
  },

  delete(id_producto: number, fecha: Date) {
    return prisma.reseñaProducto.delete({
      where: { id_producto_fecha: { id_producto, fecha } },
    });
  },
};
