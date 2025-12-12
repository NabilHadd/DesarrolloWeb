import LinkToDetail from './LinkToDetail';
import { Product } from '@/modules/products';

interface ProductRowProps {
  product: Product;
}

export default function ProductRow({ product }: ProductRowProps) {
  const formattedPrice = new Intl.NumberFormat('es-CL', { 
    style: 'currency', 
    currency: 'CLP' 
  }).format(product.precio);
  return (
    <LinkToDetail itemId={product.id_product}>
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold text-gray-800">{product.nombre}</h3>
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