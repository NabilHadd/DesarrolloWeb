import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { StockHistoryItem, SalesMetricsItem, RevenueMetricsItem } from "./types";


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


  async getFilteredProductIds(minPrice: number): Promise<number[]> {
      const products = await prisma.producto.findMany({
          where: {
              precio: { gte: minPrice },
          },
          select: {
              id_producto: true,
          },
      });
      return products.map(p => p.id_producto);
  },

  // grafico de lineas de stock global historico
  async getGlobalStockHistory(productIds: number[]): Promise<StockHistoryItem[]> {
      const data = await prisma.historialStock.groupBy({
          by: ['fecha'],
          _sum: {
              variacion: true,
          },
          where: {
              id_producto: { in: productIds },
          },
          orderBy: {
              fecha: 'asc',
          },
      });

      // format
      return data.map(item => ({
          date: item.fecha.toISOString().split('T')[0], // YYYY-MM-DD
          stock_change: item._sum.variacion || 0,
      }));
  },

  // ventas por producto (torta)
  async getSalesQuantityByProduct(productIds: number[]): Promise<SalesMetricsItem[]> {
      
      const salesData = await prisma.detalleCompra.groupBy({
          by: ['id_producto'],
          _sum: {
              cantidad: true,
          },
          where: {
              id_producto: { in: productIds },
          },
      });

      const productNames = await prisma.producto.findMany({
          where: { id_producto: { in: productIds } },
          select: { id_producto: true, nombre: true },
      });
      const nameMap = new Map(productNames.map(p => [p.id_producto, p.nombre]));

      return salesData.map(item => ({
          id_product: item.id_producto,
          nombre: nameMap.get(item.id_producto) || 'Producto Desconocido',
          total_sales_quantity: item._sum.cantidad || 0,
      }));
  },
  // ganancia por producto (barras)
  async getTotalRevenueByProduct(productIds: number[]): Promise<RevenueMetricsItem[]> {
    const revenueData = await prisma.detalleCompra.groupBy({
        by: ['id_producto'],
        _sum: {
            subtotal: true, // sumar el campo subtotal (que es tipo Decimal)
        },
        where: {
            id_producto: { in: productIds },
        },
    });

    // sacarle los nombres
    const productNames = await prisma.producto.findMany({
        where: { id_producto: { in: productIds } },
        select: { id_producto: true, nombre: true },
    });
    const nameMap = new Map(productNames.map(p => [p.id_producto, p.nombre]));

    // dec a number
    return revenueData.map(item => ({
        id_product: item.id_producto,
        nombre: nameMap.get(item.id_producto) || 'Producto Desconocido',
        total_revenue: Number(item._sum.subtotal) || 0, 
    }));
}

};
