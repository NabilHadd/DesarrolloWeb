// src/components/SalesPieChart.tsx
'use client';
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SalesMetricsItem } from '@/modules/products/types'; 

interface SalesPieChartProps {
  data: SalesMetricsItem[]; // Array con nombre del producto y total_sales_quantity
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF0000'];

export default function SalesPieChart({ data }: SalesPieChartProps) {
    
    const totalSales = data.reduce((sum, item) => sum + item.total_sales_quantity, 0);

    if (totalSales === 0) return <div className="text-center text-gray-500 py-8">No hay ventas registradas.</div>;

    const renderCustomizedLabel = ({ name, percent }: any) => {
        return `${name.substring(0, 15)}... (${(percent * 100).toFixed(0)}%)`;
    };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart margin={{ top: 20, right: 0, left: 0, bottom: 20 }}>
        <Pie
          data={data}
          dataKey="total_sales_quantity"
          nameKey="nombre"
          cx="50%" 
          cy="50%" 
          outerRadius={80} 
          fill="#8884d8"
          labelLine={false}
          label={renderCustomizedLabel} 
        >
            {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
        </Pie>
        <Tooltip 
            formatter={(value: number, name: string) => [`${value} unidades`, name]}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}