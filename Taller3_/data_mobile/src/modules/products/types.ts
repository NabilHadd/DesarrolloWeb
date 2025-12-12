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