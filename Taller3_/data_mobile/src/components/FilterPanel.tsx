'use client'; // debe ser un componente de cliente para manejar input y estado

import React from 'react';

// Tipos para el estado de los filtros (manejado por Redux)
interface Filters {
  category: string;
  minPrice: number;
  sortBy: 'price' | 'name' | 'stock';
  order: 'asc' | 'desc';
}

// Hook de simulación para manejar el estado localmente,
// hasta conectar a redux
const useSimulatedReduxFilters = () => {
  const [filters, setFilters] = React.useState<Filters>({
    category: 'all',
    minPrice: 0,
    sortBy: 'name',
    order: 'asc',
  });

  const updateFilter = (key: keyof Filters, value: string | number) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    console.log(`Filtro actualizado: ${key} = ${value}`);
    // aqui se va a disparar dipsatch de redux
  };

  return { filters, updateFilter };
};

export default function FilterPanel() {
  const { filters, updateFilter } = useSimulatedReduxFilters();

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100">
      <h2 className="text-lg font-bold mb-4 text-gray-800">Filtros Dinámicos</h2>

      {/* 1. Filtro de Categoría */}
      <div className="mb-4">
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          Categoría:
        </label>
        <select
          id="category"
          value={filters.category}
          onChange={(e) => updateFilter('category', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">Todas</option>
          <option value="electronica">Electrónica</option>
          <option value="accesorios">Accesorios</option>
        </select>
      </div>

      {/* 2. Filtro de Precio Mínimo */}
      <div className="mb-4">
        <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 mb-1">
          Precio Mínimo:
        </label>
        <input
          id="minPrice"
          type="number"
          value={filters.minPrice}
          onChange={(e) => updateFilter('minPrice', Number(e.target.value))}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="Ej: 50000"
        />
      </div>

      <h3 className="text-md font-semibold mt-6 mb-3 text-gray-800">Ordenamiento</h3>

      {/* 3. Ordenar por Campo */}
      <div className="mb-4">
        <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
          Ordenar por:
        </label>
        <select
          id="sortBy"
          value={filters.sortBy}
          onChange={(e) => updateFilter('sortBy', e.target.value as 'price' | 'name' | 'stock')}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="name">Nombre</option>
          <option value="price">Precio</option>
          <option value="stock">Stock</option>
        </select>
      </div>

      {/* 4. Orden Ascendente/Descendente */}
      <div className="mb-4">
        <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-1">
          Dirección:
        </label>
        <select
          id="order"
          value={filters.order}
          onChange={(e) => updateFilter('order', e.target.value as 'asc' | 'desc')}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="asc">Ascendente (A-Z, Menor a Mayor)</option>
          <option value="desc">Descendente (Z-A, Mayor a Menor)</option>
        </select>
      </div>
      
    </div>
  );
}