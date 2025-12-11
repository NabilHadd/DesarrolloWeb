import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Ejemplo genérico

  await prisma.administrador.create({
    data: {
        rut_admin: '111111111',
        nombre: 'prueba_seeder',
        email: 'default',
        contraseña: 'holas'
    }
  })

  console.log("Seed ejecutado correctamente!");
}

main()
  .catch((e) => {
    console.error("Error en el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
