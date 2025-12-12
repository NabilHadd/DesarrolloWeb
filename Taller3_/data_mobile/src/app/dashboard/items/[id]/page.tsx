import ProductDetail from '@/components/ProductDetail';

interface ItemDetailPageProps {
  params: {
    id: string; // ID del producto
  };
}

export default function ItemDetailPage({ params }: ItemDetailPageProps) {
  const { id } = params;

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900">Detalle: Producto ID {id}</h1>
      </header>
      
      <ProductDetail productId={id} />
    </div>
  );
}