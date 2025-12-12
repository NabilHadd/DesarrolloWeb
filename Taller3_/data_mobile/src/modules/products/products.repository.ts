import { prisma } from "@/lib/prisma";

export const productRepository = {
  findAll() {
    return prisma.producto.findMany();
  },
};
