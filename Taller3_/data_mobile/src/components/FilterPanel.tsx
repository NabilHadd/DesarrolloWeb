'use client'; 

import React from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { setFilter, FilterState } from '@/lib/features/filterSlice'; 

export default function FilterPanel() {
  // lee estado de filtros desde Redux
  const filters = useAppSelector((state) => state.filters);
  // cambia estado de filtros en Redux
  const dispatch = useAppDispatch();

  //dispara la acción de Redux
  const handleUpdateFilter = (key: keyof FilterState, value: string | number) => {
    dispatch(setFilter({ key, value }));
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100">
      <h2 className="text-lg font-bold mb-4 text-gray-800">Filtros Dinámicos</h2>

      {/* 1. Filtro de Categoría
      <div className="mb-4">
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          Categoría:
        </label>
        <select
          id="category"
          value={filters.category}
          // cambia estado global
          onChange={(e) => handleUpdateFilter('category', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">Todas</option>
          <option value="electronica">Electrónica</option>
          <option value="accesorios">Accesorios</option>
        </select>
      </div> */}

      {/* 2. Filtro de Precio Mínimo */}
      <div className="mb-4">
        <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 mb-1">
          Precio Mínimo:
        </label>
        <input
          id="minPrice"
          type="number"
          value={filters.minPrice}
          // 3. Usa handleUpdateFilter para cambiar el estado global
          onChange={(e) => handleUpdateFilter('minPrice', Number(e.target.value))}
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
          // 3. Usa handleUpdateFilter para cambiar el estado global
          onChange={(e) => handleUpdateFilter('sortBy', e.target.value)}
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
          // 3. Usa handleUpdateFilter para cambiar el estado global
          onChange={(e) => handleUpdateFilter('order', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="asc">Ascendente</option>
          <option value="desc">Descendente</option>
        </select>
      </div>
      
      <p className="text-xs text-green-500 mt-4">
        ¡Estado de filtros globalmente persistente vía Redux!
      </p>
    </div>
  );
}