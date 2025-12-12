import ProductRow from './ProductRow';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
}

const DUMMY_PRODUCTS: Product[] = [
  { id: '1', name: 'Laptop Pro X', category: 'Electrónica', price: 950000, stock: 25 },
  { id: '2', name: 'Teclado Mecánico', category: 'Accesorios', price: 65000, stock: 8 },
  { id: '3', name: 'Monitor 4K Ultra', category: 'Electrónica', price: 320000, stock: 12 },
];

export default function ProductTable() {
  //aqui se tiene que hacer el fetch
  
  const products = DUMMY_PRODUCTS;

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold mb-3 text-gray-700">Registros de Productos</h2>
      <div className="flex flex-col gap-2">
        {products.map((product) => (
          <ProductRow key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}