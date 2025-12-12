// src/components/StockLineChart.tsx
'use client';
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { StockHistoryItem } from '@/modules/products/types'; 

interface StockLineChartProps {
  data: StockHistoryItem[];
}

export default function StockLineChart({ data }: StockLineChartProps) {
  
  if (!data || data.length === 0) {
      return (
          <div className="text-center text-gray-500 py-8">
              No hay datos históricos disponibles para estos filtros.
          </div>
      );
  }

  // Si la data solo tiene una fecha, Recharts no puede dibujar una línea.
  if (data.length < 2) {
      return (
          <div className="text-center text-gray-500 py-8">
              Se requiere historial con al menos dos puntos de fecha.
          </div>
      );
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        {/* X Fecha */}
        <XAxis dataKey="date" stroke="#6b7280" /> 
        {/* Y Variación de Stock */}
        <YAxis 
            stroke="#6b7280" 
            label={{ value: 'Variación de Stock', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip 
            formatter={(value: number) => [`${value} unidades`, 'Variación Diaria']}
            labelFormatter={(label) => `Fecha: ${label}`}
        />
        <Legend />
        {/* Usamos 'stock_change' del tipo StockHistoryItem como dataKey */}
        <Line 
            type="monotone" 
            dataKey="stock_change" 
            stroke="#10B981" // Color verde
            strokeWidth={2}
            activeDot={{ r: 8 }} 
            name="Variación Stock Neto"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}