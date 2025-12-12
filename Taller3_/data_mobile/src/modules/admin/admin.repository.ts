import { prisma } from "@/lib/prisma";

export const adminRepository = {
  findAll() {
    return prisma.administrador.findMany();
  },
};
