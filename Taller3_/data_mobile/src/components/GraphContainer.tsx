import ProductSalesChart from './ProductSalesChart';

interface GraphContainerProps {
  productId: string;
  // Podrías pasar datos o hacer fetching aquí.
}

// Datos simulados para los gráficos
const DUMMY_SALES_DATA = [
  { month: 'Ene', sales: 150 },
  { month: 'Feb', sales: 210 },
  { month: 'Mar', sales: 180 },
  { month: 'Abr', sales: 300 },
];

export default function GraphContainer({ productId }: GraphContainerProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ProductSalesChart data={DUMMY_SALES_DATA} />
      
      {/* Aquí irían los otros 4+ tipos de gráficos requeridos por el taller.
        Ejemplo: Gráfico de Stock vs Historial, Gráfico de Reseñas (Torta).
      */}
      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100 flex items-center justify-center h-full">
        <p className="text-gray-400">Otro Gráfico (Tipo Torta/KPI) para Producto {productId}</p>
      </div>
    </div>
  );
}