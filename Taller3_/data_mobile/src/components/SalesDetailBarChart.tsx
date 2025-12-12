'use client';
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Product } from '@/modules/products';

interface SalesDetailBarChartProps {
  sales: Product['detalleCompras'];
  productName: string;
}

export default function SalesDetailBarChart({ sales, productName }: SalesDetailBarChartProps) {

    // Formatear datos para el gráfico: Usamos id_compra como eje X
    const chartData = sales?.map(item => ({
        id_compra: `#${item.id_compra}`,
        cantidad: item.cantidad,
        subtotal: Number(item.subtotal), // Convertir Decimal (String) a Number
    }));

    if (!chartData || chartData.length === 0) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 text-center text-gray-500">
                <h3 className="text-xl font-semibold mb-2">Historial de Ventas</h3>
                <p>Este producto no tiene registros de ventas.</p>
            </div>
        );
    }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <h3 className="text-xl font-semibold mb-2">Unidades Vendidas por Compra</h3>
        <ResponsiveContainer width="100%" height={300}>
            <BarChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
                {/* XAxis muestra el ID de la Compra */}
                <XAxis 
                    dataKey="id_compra" 
                    stroke="#6b7280" 
                    label={{ value: 'ID de Compra', position: 'bottom', offset: 0 }}
                />
                <YAxis 
                    stroke="#6b7280" 
                    label={{ value: 'Unidades Vendidas', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                    formatter={(value: number, name: string, props) => {
                        const subtotalFormatted = new Intl.NumberFormat('es-CL', { 
                            style: 'currency', 
                            currency: 'CLP' 
                        }).format(props.payload.subtotal);
                        
                        return [
                            [`Unidades: ${value}`, ''], 
                            [`Subtotal: ${subtotalFormatted}`, '']
                        ];
                    }}
                    labelFormatter={(label) => `Compra: ${label}`}
                />
                <Bar 
                    dataKey="cantidad" 
                    fill="#F59E0B" // Color ámbar
                    name="Cantidad"
                />
            </BarChart>
        </ResponsiveContainer>
    </div>
  );
}