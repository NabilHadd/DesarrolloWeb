import GraphContainer from './GraphContainer';
import ProductReview from './ProductReviewSummary';
import { Product } from '@/modules/products';


export default function ProductDetail(props: {product: Product}) {
  // Nota: Aquí se haría el fetch a la API: /api/products/[id]
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
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{product.nombre}</h2>
        <p className="text-lg text-blue-600 mb-4 font-mono">{formattedPrice}</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
          <p><strong>Última Actualización:</strong> {fechaReciente}</p>
        </div>
      </div>

      {/* 3. Sección de Gráficos (Requisito: Gráficos interactivos) */}
      <GraphContainer productId={''} />

      {/* 4. Resumen de Reseñas */}
      <ProductReview rating={promedio} count={totalReseñas} />
    </div>
  );
}