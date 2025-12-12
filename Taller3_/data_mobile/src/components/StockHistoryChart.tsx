'use client';
import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Product } from '@/modules/products'; 
import { HistorialStockItem } from '@/modules/products/types'; // Asumimos que tienes el tipo HistorialStockItem

interface StockHistoryChartProps {
  historial: Product['historial']; 
  productName: string;
  currentStock: number; // <-- NUEVA PROP
}

interface ChartDataItem {
    fecha: string;
    stock_acumulado: number;
    variacion: number;
}

export default function StockHistoryChart({ historial, productName, currentStock }: StockHistoryChartProps) {

  const chartData: ChartDataItem[] = useMemo(() => {
    if (!historial || historial.length === 0) return [];
    
    // 1. Ordenamos el historial de forma ascendente (más antiguo primero)
    const sortedHistorial = [...historial].sort(
        (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
    );

    // 2. Calculamos la variación total neta
    const totalNetChange = sortedHistorial.reduce((sum, item) => sum + item.variacion, 0);

    // 3. Calculamos el stock inicial antes del primer movimiento
    // Stock Inicial = Stock Actual - Variación Total
    let currentAccumulatedStock = currentStock - totalNetChange; 
    
    // 4. Mapeamos y acumulamos el stock a lo largo del tiempo
    const dataWithInitial: ChartDataItem[] = [{
        fecha: "Inicio", // Punto de referencia antes del primer movimiento
        stock_acumulado: currentAccumulatedStock,
        variacion: 0,
    }];
    
    sortedHistorial.forEach((item) => {
        currentAccumulatedStock += item.variacion;
        dataWithInitial.push({
            fecha: new Date(item.fecha).toLocaleDateString('es-CL'),
            stock_acumulado: currentAccumulatedStock,
            variacion: item.variacion,
        });
    });
    
    return dataWithInitial;
    
  }, [historial, currentStock]); // Dependencia del historial y stock actual

  if (chartData.length <= 1) { // Solo tendrá "Inicio" si no hay historial real
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 text-center text-gray-500">
        <h3 className="text-xl font-semibold mb-2">Historial de Stock</h3>
        <p>No hay suficientes registros de stock para dibujar la línea de tiempo.</p>
      </div>
    );
  }

  return (
    // ... (El resto del componente de Recharts se mantiene igual) ...
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <h3 className="text-xl font-semibold mb-2">Historial de Stock: {productName}</h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={chartData}
          // ...
        >
          {/* ... (CartesianGrid, XAxis, YAxis) ... */}
          <XAxis dataKey="fecha" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip 
             formatter={(value: number, name: string, props) => {
                if (name === 'Stock Acumulado') {
                   // Si el punto es una variación real, mostramos el cambio
                   const variacionDisplay = props.payload.variacion !== 0 ? ` (Cambio: ${props.payload.variacion > 0 ? '+' : ''}${props.payload.variacion})` : '';
                   return [value, `Stock${variacionDisplay}`];
                }
                return null;
             }}
             labelFormatter={(label) => `Fecha: ${label}`}
          />
          <Legend />
          <Line 
            type="stepAfter" // Usamos stepAfter o stepBefore para mostrar un cambio instantáneo
            dataKey="stock_acumulado" 
            stroke="#4F46E5" 
            strokeWidth={2}
            name="Stock Acumulado"
            dot={{ r: 4 }} // Puntos en cada cambio
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}