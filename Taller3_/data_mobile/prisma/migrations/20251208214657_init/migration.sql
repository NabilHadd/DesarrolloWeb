-- CreateTable
CREATE TABLE "Administrador" (
    "rut_admin" VARCHAR(20) NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "contraseña" VARCHAR(255) NOT NULL,

    CONSTRAINT "Administrador_pkey" PRIMARY KEY ("rut_admin")
);

-- CreateTable
CREATE TABLE "Producto" (
    "id_producto" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" VARCHAR(255) NOT NULL,
    "precio" DECIMAL(10,2) NOT NULL,
    "stock" INTEGER NOT NULL,
    "imagen" BYTEA NOT NULL,

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("id_producto")
);

-- CreateTable
CREATE TABLE "ReseñaProducto" (
    "id_producto" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valoracion" INTEGER NOT NULL,
    "descripcion" VARCHAR(255),

    CONSTRAINT "ReseñaProducto_pkey" PRIMARY KEY ("id_producto","fecha")
);

-- CreateTable
CREATE TABLE "Compra" (
    "id_compra" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total" DECIMAL(10,2) NOT NULL,
    "rut_comprador" TEXT NOT NULL,
    "rut_admin" TEXT NOT NULL,

    CONSTRAINT "Compra_pkey" PRIMARY KEY ("id_compra")
);

-- CreateTable
CREATE TABLE "DetalleCompra" (
    "id_compra" INTEGER NOT NULL,
    "id_producto" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "DetalleCompra_pkey" PRIMARY KEY ("id_compra","id_producto")
);

-- CreateTable
CREATE TABLE "HistorialStock" (
    "id_movimiento" SERIAL NOT NULL,
    "id_producto" INTEGER NOT NULL,
    "variacion" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "descripcion" VARCHAR(255) NOT NULL,

    CONSTRAINT "HistorialStock_pkey" PRIMARY KEY ("id_movimiento")
);

-- CreateTable
CREATE TABLE "LogAdmin" (
    "id_log" SERIAL NOT NULL,
    "rut_admin" TEXT NOT NULL,
    "accion" VARCHAR(255) NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LogAdmin_pkey" PRIMARY KEY ("id_log")
);

-- AddForeignKey
ALTER TABLE "ReseñaProducto" ADD CONSTRAINT "ReseñaProducto_id_producto_fkey" FOREIGN KEY ("id_producto") REFERENCES "Producto"("id_producto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Compra" ADD CONSTRAINT "Compra_rut_admin_fkey" FOREIGN KEY ("rut_admin") REFERENCES "Administrador"("rut_admin") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleCompra" ADD CONSTRAINT "DetalleCompra_id_compra_fkey" FOREIGN KEY ("id_compra") REFERENCES "Compra"("id_compra") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleCompra" ADD CONSTRAINT "DetalleCompra_id_producto_fkey" FOREIGN KEY ("id_producto") REFERENCES "Producto"("id_producto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistorialStock" ADD CONSTRAINT "HistorialStock_id_producto_fkey" FOREIGN KEY ("id_producto") REFERENCES "Producto"("id_producto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogAdmin" ADD CONSTRAINT "LogAdmin_rut_admin_fkey" FOREIGN KEY ("rut_admin") REFERENCES "Administrador"("rut_admin") ON DELETE RESTRICT ON UPDATE CASCADE;
