interface ProductSalesChartProps {
  data: { month: string; sales: number }[];
}

export default function ProductSalesChart({ data }: ProductSalesChartProps) {
  // logica y componente de lib de graficso
  
  const totalSales = data.reduce((sum, item) => sum + item.sales, 0);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100">
      <h3 className="text-lg font-semibold mb-3">Ventas Históricas</h3>
      <div className="h-48 flex items-center justify-center bg-blue-50 rounded-md text-blue-700">
        [Renderizado de Gráfico de Líneas/Barras: {totalSales} ventas en total]
      </div>
    </div>
  );
}