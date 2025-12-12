import StockHistoryChart from './StockHistoryChart'; 
import SalesDetailBarChart from './SalesDetailBarChart';
import ProductReview from './ProductReviewSummary';
import { Product } from '@/modules/products';


export default function ProductDetail(props: {product: Product}) {
  // Nota: Aqui fetch a la API: /api/products/[id]
  const product = props.product;
  const formattedPrice = new Intl.NumberFormat('es-CL', { 
    style: 'currency', 
    currency: 'CLP' 
  }).format(product.precio);

  const historial = product.historial;
  
  const historialOrdenado = historial?.sort(
    (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  );

  const fechaReciente = historialOrdenado?.[0]?.fecha;

  const reseñas = product.reseñas;
  
  const totalReseñas = reseñas?.length ? reseñas?.length : 0;

  const promedio = totalReseñas > 0
  ? reseñas?.reduce((sum, r) => sum + r.valoracion, 0) / totalReseñas
  : 0;

  return (
    <div className="space-y-8">
      {/* ... (Tarjeta de información del producto) ... */}

      {/* 3. Sección de Gráficos de Detalle */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Gráfico 1: Historial de Stock */}
        <StockHistoryChart 
          historial={product.historial || []} 
          productName={product.nombre} 
          currentStock={product.stock} // <-- ¡IMPORTANTE! Pasamos el stock actual (40)
        />

        {/* Gráfico 2: Ventas por Compra */}
        <SalesDetailBarChart 
          sales={product.detalleCompras || []} 
          productName={product.nombre} 
        />
      </div>

      {/* 4. Resumen de Reseñas */}
      <ProductReview rating={promedio} count={totalReseñas} />
    </div>
  );
}