// src/components/MetricsContainer.tsx
'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAppSelector } from '@/lib/hooks'; 
import { Product } from '@/modules/products';  
import { ProductMetrics } from "@/modules/products/types";
import StockLineChart from './StockLineChart'; 
import SalesPieChart from './SalesPieChart';
import CurrentStockBarChart from './CurrentStockBarChart';

interface MetricsContainerProps {
    products: Product[]; // Productos ya filtrados por el DashboardPage
}

// estructura de métricas mínima para evitar errores
const initialMetrics: ProductMetrics = {
    stockHistory: [], // Gráfico 1
    salesByProduct: [], // Gráfico 2
};

export default function MetricsContainer({ products }: MetricsContainerProps) {
    const filters = useAppSelector((state) => state.filters);
    
    const [metrics, setMetrics] = useState<ProductMetrics>(initialMetrics); 
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setIsLoading(true);
        setError(null);
        
        const queryParams = new URLSearchParams(filters as Record<string, any>).toString();

        // 1. Fetch para Gráficos 1 y 2 (Stock Histórico y Ventas Totales)
        axios.get(`http://localhost:3001/api/products/metrics?${queryParams}`)
            .then(res => {
                setMetrics(res.data);
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Error fetching metrics:", err);
                setError("Error al cargar métricas históricas y de ventas.");
                setIsLoading(false);
            });
    }, [filters]); 

    if (isLoading && products.length === 0) {
        return <div className="p-4 bg-yellow-100 text-yellow-800 rounded-md">Cargando métricas...</div>;
    }

    if (error) {
        return <div className="p-4 bg-red-100 text-red-800 rounded-md">Error de Métricas: {error}</div>;
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                
                {/* 1. GRÁFICO DE LÍNEAS (Variación de Stock Histórica) */}
                <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100 col-span-full xl:col-span-1">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Variación de Stock Histórica (Global Filtrada)</h3>
                    {metrics.stockHistory && metrics.stockHistory.length > 0 ? (
                        <StockLineChart data={metrics.stockHistory} />
                    ) : (
                        <p className="text-center text-gray-500 py-8">No hay registros de movimientos de stock para estos filtros.</p>
                    )}
                </div>

                {/* 2. GRÁFICO DE TORTA (Ventas Totales por Producto) */}
                <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Distribución de Ventas por Producto</h3>
                    {metrics.salesByProduct && metrics.salesByProduct.length > 0 ? (
                        <SalesPieChart data={metrics.salesByProduct} />
                    ) : (
                        <p className="text-center text-gray-500 py-8">No hay registros de ventas para estos productos.</p>
                    )}
                </div>
                
                {/* 3. HISTOGRAMA/BARRAS (Stock Actual por Producto) */}
                <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Stock Actual por Producto (Filtrado)</h3>
                    {products.length > 0 ? (
                        <CurrentStockBarChart data={products} />
                    ) : (
                        <p className="text-center text-gray-500 py-8">No hay productos disponibles con los filtros actuales.</p>
                    )}
                </div>
            </div>
        </div>
    );
}