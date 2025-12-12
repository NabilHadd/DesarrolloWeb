import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Limpiar tablas antes de agregar registros
  await prisma.administrador.deleteMany({});
  await prisma.producto.deleteMany({});

  // Crear admin
  await prisma.administrador.create({
    data: {
      rut_admin: '111111111',
      nombre: 'prueba_seeder',
      email: 'default',
      contraseña: 'holas',
    },
  });

  // Datos de productos de ejemplo
  const products: Prisma.ProductoCreateInput[] = [
    { nombre: 'Laptop Pro X', descripcion: 'Laptop de alta gama', precio: 950000, stock: 25, imagen: new Uint8Array() },
    { nombre: 'Smartphone Z', descripcion: 'Teléfono inteligente', precio: 550000, stock: 40, imagen: new Uint8Array() },
    { nombre: 'Auriculares Bluetooth', descripcion: 'Auriculares inalámbricos', precio: 120000, stock: 50, imagen: new Uint8Array() },
    { nombre: 'Monitor 27"', descripcion: 'Monitor Full HD', precio: 250000, stock: 30, imagen: new Uint8Array() },
  ];

  // Insertar productos
  for (const product of products) {
    await prisma.producto.create({ data: product });
  }

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
