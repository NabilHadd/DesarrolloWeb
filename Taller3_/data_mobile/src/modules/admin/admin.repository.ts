import { prisma } from "@/src/lib/prisma";

export const adminRepository = {
  findAll() {
    return prisma.administrador.findMany();
  },
};
