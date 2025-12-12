import LinkToDetail from './LinkToDetail';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
}

interface ProductRowProps {
  product: Product;
}

export default function ProductRow({ product }: ProductRowProps) {
  const formattedPrice = new Intl.NumberFormat('es-CL', { 
    style: 'currency', 
    currency: 'CLP' 
  }).format(product.price);
  return (
    <LinkToDetail itemId={product.id}>
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
          <p className="text-sm text-gray-500">{product.category}</p>
        </div>
        <div className="text-right">
          <p className="font-bold text-green-600">{formattedPrice}</p>
          <p className={`text-sm ${product.stock < 10 ? 'text-red-500' : 'text-gray-600'}`}>
            Stock: {product.stock} unidades
          </p>
        </div>
      </div>
    </LinkToDetail>
  );
}