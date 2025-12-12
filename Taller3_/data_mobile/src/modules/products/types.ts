import { Bytes } from "@prisma/client/runtime/library";

export interface Product {
    id_producto: number;
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
    imagen: Bytes;
    reseñas?: any[];
    detalleCompras?: any[]
    historial?: any[];
}

export interface HistorialStockItem {
    fecha: string; // O Date
    variacion: number;
    descripcion: string;
}

export interface StockHistoryItem {
    date: string; // fecha truncada (YYYY-MM-DD)
    stock_change: number; 
}

export interface SalesMetricsItem {
    id_product: number;
    nombre: string;
    total_sales_quantity: number;
    [key: string]: any;
}

export interface ProductMetrics {
    stockHistory: StockHistoryItem[];
    salesByProduct: SalesMetricsItem[];
}