"use client";
import FilterPanel from '@/components/FilterPanel';
import ProductTable from '@/components/ProductTable';
import Image from "next/image";
import React, {useEffect, useState} from "react";
import axios  from "axios";
import {Admin} from "src/modules/admin/types"

export default function DashboardPage() {
  
  const [admin, setAdmin] = useState<Admin[] | null>(null);
  const [error, setError] = useState();

  useEffect(() => {
    axios.get(`http://localhost:3001/api/admin`)
    .then(res => {
      setAdmin(res.data);
      console.log(JSON.stringify(res));
    })
    .catch(err => {
      setError(err.error);
    });
  }, [])


  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900">Dashboard de Productos </h1>
        <p className="text-gray-500">Visualización de registros y métricas de e-commerce.</p>
        <p className="bg-green-400 flex justify-center m-4">{admin?.[0].nombre}</p>
      </header>
      
      {/* Estructura Mobile-First: Filtros encima de la tabla en móvil */}
      <main className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        <aside className="md:col-span-1">
          <FilterPanel /> {/* Implementación de filtros dinámicos (Redux) */}
        </aside>

        <section className="md:col-span-3">
          <ProductTable /> {/* Lista de productos (con LinkToDetail) */}
        </section>
      </main>
    </div>
  );
}