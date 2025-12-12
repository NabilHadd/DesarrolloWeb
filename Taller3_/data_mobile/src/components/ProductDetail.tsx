import StockHistoryChart from './StockHistoryChart'; 
import SalesDetailBarChart from './SalesDetailBarChart';
import ProductReview from './ProductReviewSummary';
import { Product } from '@/modules/products';


export default function ProductDetail(props: {product: Product}) {
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Historial de Stock */}
        <StockHistoryChart 
          historial={product.historial || []} 
          productName={product.nombre} 
          currentStock={product.stock} // 
        />

        {/* Ventas por Compra */}
        <SalesDetailBarChart 
          sales={product.detalleCompras || []} 
          productName={product.nombre} 
        />
      </div>

      {/* Resumen de Reseñas */}
      <ProductReview rating={promedio} count={totalReseñas} />
    </div>
  );
}