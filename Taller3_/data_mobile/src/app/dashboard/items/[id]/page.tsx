"use client";

import ProductDetail from '@/components/ProductDetail';
import { useEffect, useState } from 'react';
import { Product } from '@/modules/products';
import axios from 'axios';
import { useParams } from 'next/navigation';

export default function ItemDetailPage() {
  const params = useParams(); // hook para rutas dinámicas
  const id = Number(params.id); // convertir a número si es necesario
  const [product, setProduct] = useState<Product>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log(typeof(id))
    console.log(id)
    if (!id) return;

    axios
      .get(`/api/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => setError(err.response?.data?.error || err.message));
  }, [id]);

  if (!product) return <p>{error || "Cargando el producto..."}</p>;

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Detalle: Producto ID {id}
        </h1>
      </header>

      <ProductDetail product={product} />
    </div>
  );
}
