import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database completo...");

  // Limpiar tablas
  await prisma.logAdmin.deleteMany({});
  await prisma.historialStock.deleteMany({});
  await prisma.reseñaProducto.deleteMany({});
  await prisma.detalleCompra.deleteMany({});
  await prisma.compra.deleteMany({});
  await prisma.producto.deleteMany({});
  await prisma.administrador.deleteMany({});

  // Administradores
  await prisma.administrador.createMany({
    data: [
      { rut_admin: "111111111", nombre: "Juan Pérez", email: "juan@example.com", contraseña: "admin123" },
      { rut_admin: "222222222", nombre: "María López", email: "maria@example.com", contraseña: "admin456" },
    ],
  });

  // Productos
  const productosData: Prisma.ProductoCreateInput[] = [
    { nombre: "Laptop Pro X", descripcion: "Laptop de alto rendimiento", precio: 950000, stock: 25, imagen: new Uint8Array(0) },
    { nombre: "Smartphone Z", descripcion: "Teléfono inteligente gama alta", precio: 550000, stock: 40, imagen: new Uint8Array(0) },
    { nombre: "Auriculares Bluetooth", descripcion: "Auriculares inalámbricos", precio: 120000, stock: 50, imagen: new Uint8Array(0) },
    { nombre: "Monitor 4K", descripcion: "Monitor de alta resolución", precio: 300000, stock: 15, imagen: new Uint8Array(0) },
    { nombre: "Teclado Mecánico", descripcion: "Teclado mecánico retroiluminado", precio: 90000, stock: 30, imagen: new Uint8Array(0) },
    { nombre: "Mouse Gaming", descripcion: "Mouse ergonómico con alta precisión", precio: 45000, stock: 45, imagen: new Uint8Array(0) },
    { nombre: "Tablet X10", descripcion: "Tablet para productividad y entretenimiento", precio: 350000, stock: 20, imagen: new Uint8Array(0) },
  ];

  const productos = [];
  for (const p of productosData) {
    const prod = await prisma.producto.create({ data: p });
    productos.push(prod);
  }

  // Clientes de ejemplo
  const clientes = Array.from({ length: 10 }, (_, i) => `cliente${i + 1}`);

  // Crear compras y detalles
  for (const producto of productos) {
    const numCompras = Math.floor(Math.random() * 4) + 2; // 2-5 compras por producto
    for (let i = 0; i < numCompras; i++) {
      const cantidad = Math.floor(Math.random() * 5) + 1;
      const precioTotal = Number(producto.precio) * cantidad;
      const fecha = new Date();
      fecha.setDate(fecha.getDate() - Math.floor(Math.random() * 30));

      const compra = await prisma.compra.create({
        data: {
          total: precioTotal,
          rut_comprador: clientes[Math.floor(Math.random() * clientes.length)],
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

  // Reseñas
  const comentarios = [
    "Excelente producto",
    "Muy satisfecho",
    "No cumplió mis expectativas",
    "Recomendado 100%",
    "Podría ser mejor",
    "Gran relación precio/calidad",
  ];

  for (const producto of productos) {
    const numReseñas = Math.floor(Math.random() * 3) + 1; // 1-3 reseñas por producto
    for (let i = 0; i < numReseñas; i++) {
      await prisma.reseñaProducto.create({
        data: {
          id_producto: producto.id_producto,
          fecha: new Date(Date.now() - Math.floor(Math.random() * 1000000000)),
          valoracion: Math.floor(Math.random() * 5) + 1,
          descripcion: comentarios[Math.floor(Math.random() * comentarios.length)],
        },
      });
    }
  }

  // Logs de administradores
  const acciones = ["Creó producto", "Actualizó producto", "Eliminó producto", "Registró venta"];
  for (const admin of ["111111111", "222222222"]) {
    const numLogs = Math.floor(Math.random() * 5) + 2;
    for (let i = 0; i < numLogs; i++) {
      await prisma.logAdmin.create({
        data: {
          rut_admin: admin,
          accion: acciones[Math.floor(Math.random() * acciones.length)],
          fecha: new Date(Date.now() - Math.floor(Math.random() * 1000000000)),
        },
      });
    }
  }

  console.log("Seed completo generado correctamente!");
}

main()
  .catch((e) => {
    console.error("Error en el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
