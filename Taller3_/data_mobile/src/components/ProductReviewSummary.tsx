interface ProductReviewProps {
  rating: number;
  count: number;
}

export default function ProductReview({ rating, count }: ProductReviewProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <h3 className="text-xl font-semibold mb-3">Métricas de Satisfacción</h3>
      <div className="flex items-baseline space-x-2">
        <span className="text-4xl font-extrabold text-yellow-500">{rating.toFixed(1)}</span>
        <span className="text-gray-500">/ 5 estrellas</span>
      </div>
      <p className="text-sm text-gray-600 mt-1">Basado en {count} reseñas.</p>
    </div>
  );
}