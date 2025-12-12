import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Limpiar tablas
  await prisma.logAdmin.deleteMany({});
  await prisma.historialStock.deleteMany({});
  await prisma.reseñaProducto.deleteMany({});
  await prisma.detalleCompra.deleteMany({});
  await prisma.compra.deleteMany({});
  await prisma.producto.deleteMany({});
  await prisma.administrador.deleteMany({});

  // Administradores
  const admins = await prisma.administrador.createMany({
    data: [
      { rut_admin: "111111111", nombre: "Juan Pérez", email: "juan@example.com", contraseña: "admin123" },
      { rut_admin: "222222222", nombre: "María López", email: "maria@example.com", contraseña: "admin456" },
    ],
  });

  // Productos
  const productosData: Prisma.ProductoCreateInput[] = [
    { nombre: "Laptop Pro X", descripcion: "Laptop de alto rendimiento", precio: 950000, stock: 25, imagen: new Uint8Array() },
    { nombre: "Smartphone Z", descripcion: "Teléfono inteligente gama alta", precio: 550000, stock: 40, imagen: new Uint8Array() },
    { nombre: "Auriculares Bluetooth", descripcion: "Auriculares inalámbricos", precio: 120000, stock: 50, imagen: new Uint8Array() },
  ];

  const productos = [];
  for (const p of productosData) {
    const prod = await prisma.producto.create({ data: p });
    productos.push(prod);
  }

  // Crear múltiples compras por producto
  for (const producto of productos) {
    for (let i = 0; i < 3; i++) { // 3 compras por producto
      const cantidad = Math.floor(Math.random() * 5) + 1;
      const precioTotal = Number(producto.precio) * cantidad;
      const fecha = new Date();
      fecha.setDate(fecha.getDate() - Math.floor(Math.random() * 30)); // fechas aleatorias en últimos 30 días

      const compra = await prisma.compra.create({
        data: {
          total: precioTotal,
          rut_comprador: `cliente${Math.floor(Math.random() * 1000)}`,
          rut_admin: i % 2 === 0 ? "111111111" : "222222222",
          fecha,
          detalles: {
            create: [
              {
                id_producto: producto.id_producto,
                cantidad,
                subtotal: precioTotal,
              },
            ],
          },
        },
      });

      // Historial de stock
      await prisma.historialStock.create({
        data: {
          id_producto: producto.id_producto,
          variacion: -cantidad,
          descripcion: `Venta compra #${compra.id_compra}`,
          fecha,
        },
      });
    }
  }

  console.log("Seed con varias ventas generado correctamente!");
}

main()
  .catch((e) => {
    console.error("Error en el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
