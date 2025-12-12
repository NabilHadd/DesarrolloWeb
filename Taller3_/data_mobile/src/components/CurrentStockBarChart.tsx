// src/components/CurrentStockBarChart.tsx
'use client';
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Product } from '@/modules/products'; 

interface CurrentStockBarChartProps {
  data: Product[]; // Lista de productos ya filtrada (Chart 3)
}

export default function CurrentStockBarChart({ data }: CurrentStockBarChartProps) {
    
    const chartData = data.map(p => ({
        nombre: p.nombre,
        stock: p.stock,
    }));
    
    if (chartData.length === 0) return <div className="text-center text-gray-500 py-8">No hay productos para mostrar.</div>;

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={chartData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
        <XAxis 
            dataKey="nombre" 
            angle={-30} 
            textAnchor="end" 
            height={70} 
            interval={0} 
            stroke="#6b7280" 
        />
        <YAxis 
            label={{ value: 'Stock Actual', angle: -90, position: 'insideLeft' }}
            stroke="#6b7280"
        />
        <Tooltip 
            formatter={(value: number) => [`${value} unidades`, 'Stock Actual']}
        />
        <Bar 
            dataKey="stock" 
            fill="#3B82F6" 
            name="Stock Actual"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}