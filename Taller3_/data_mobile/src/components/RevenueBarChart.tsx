// src/components/RevenueBarChart.tsx
'use client';
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { RevenueMetricsItem } from '@/modules/products/types'; 

interface RevenueBarChartProps {
  data: RevenueMetricsItem[];
}

export default function RevenueBarChart({ data }: RevenueBarChartProps) {
    if (!data || data.length === 0) {
        return (
            <div className="text-center text-gray-500 py-8">
                No hay datos de ingresos disponibles para estos filtros.
            </div>
        );
    }
    
    // formato CLP
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value);
    };

    // ordenar mayor a menor
    const sortedData = [...data].sort((a, b) => b.total_revenue - a.total_revenue);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={sortedData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
        {/* Eje X: Nombre del Producto */}
        <XAxis 
            dataKey="nombre" 
            angle={-30} 
            textAnchor="end" 
            height={70} 
            interval={0} 
            stroke="#6b7280" 
        />
        {/* Eje Y: Total Recaudado (con formato peso chileno) */}
        <YAxis 
            stroke="#6b7280"
            tickFormatter={formatCurrency}
        />
        <Tooltip 
            formatter={(value: number, name: string) => [formatCurrency(value), 'Recaudación Total']}
            labelFormatter={(label) => `Producto: ${label}`}
        />
        <Bar 
            dataKey="total_revenue" 
            fill="#FBBF24" 
            name="Recaudación Total"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}