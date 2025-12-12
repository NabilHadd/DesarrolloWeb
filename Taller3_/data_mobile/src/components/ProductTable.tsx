import ProductRow from './ProductRow';
import { Product } from '@/modules/products';

export default function asyncProductTable(props: {products: Product[]}) {

  const products = props.products;

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold mb-3 text-gray-700">Registros de Productos</h2>
      <div className="flex flex-col gap-2">
        {products.map((product) => (
          <ProductRow key={product.id_producto} product={product} />
        ))}
      </div>
    </div>
  );
}