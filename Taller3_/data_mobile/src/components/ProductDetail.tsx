import GraphContainer from './GraphContainer';
import ProductReview from './ProductReviewSummary';

interface ProductDetailProps {
  productId: string;
}

// Datos de detalle simulados
const DUMMY_DETAIL = {
  name: 'Laptop Pro X',
  description: 'Un equipo de alto rendimiento, ideal para desarrollo y diseño.',
  currentPrice: 950000,
  category: 'Electrónica',
  lastUpdate: '2025-12-01',
  reviews: { avgRating: 4.5, count: 85 }
};

export default async function ProductDetail({ productId }: ProductDetailProps) {
  // Nota: Aquí se haría el fetch a la API: /api/products/[id]
  const product = DUMMY_DETAIL;
  const formattedPrice = new Intl.NumberFormat('es-CL', { 
    style: 'currency', 
    currency: 'CLP' 
  }).format(product.currentPrice);

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h2>
        <p className="text-lg text-blue-600 mb-4 font-mono">{formattedPrice}</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
          <p><strong>Categoría:</strong> {product.category}</p>
          <p><strong>Última Actualización:</strong> {product.lastUpdate}</p>
        </div>
      </div>

      {/* 3. Sección de Gráficos (Requisito: Gráficos interactivos) */}
      <GraphContainer productId={productId} />

      {/* 4. Resumen de Reseñas */}
      <ProductReview rating={product.reviews.avgRating} count={product.reviews.count} />
    </div>
  );
}