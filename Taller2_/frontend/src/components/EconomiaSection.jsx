import React, { useEffect, useState } from "react";
import AnimatedText from "./AnimatedText";
import { ReactComponent as EconomiaIcon } from '../icons/economia.svg';
import axios from "axios";

export default function SectionEconomia({ isExpanded, onToggle }) {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [valor, setValor] = useState(null);

  const formatDate = (isoString) => isoString ? isoString.split("T")[0] : "";

  // Traer todos los indicadores al montar el componente
  useEffect(() => {
    axios.get('http://localhost:PUERTO/indicator')
      .then(res => setItems(res.data))
      .catch(err => console.error(err));
  }, []);

  // Traer el valor del ítem seleccionado en la fecha seleccionada
  useEffect(() => {
    if (!selectedItem || !selectedDate) return;

    axios.get(`http://localhost:PUERTO/indicator/${selectedItem}/${selectedDate}`)
      .then(res => setValor(res.data))
      .catch(err => console.error(err));
  }, [selectedItem, selectedDate]);

  return (
    <section className="w-full max-w-5xl mx-auto bg-white/95 rounded-2xl px-6 py-5 border border-green-100 shadow-lg shadow-green-500/10 transition-shadow animate-section-entry">
      {/* Botón para expandir/colapsar */}
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center justify-between gap-4 w-full text-left focus:outline-none hover:opacity-90 transition-opacity "
      >
        <div className="flex items-center gap-3">
          <span className="section-icon text-slate-900 w-10 h-10 rounded-full bg-green-50 border border-green-100 flex items-center justify-center shadow-inner shadow-white/60">
            <EconomiaIcon className="w-6 h-6" />
          </span>
          <AnimatedText
            as="h2"
            text="Economía de Chile"
            isActive
            className="text-2xl font-bold text-green-700"
            speed={14}
          />
        </div>
        <span className="text-xs uppercase tracking-wide text-indigo-700/70 font-semibold">
          Panel interactivo
        </span>
      </button>

      {/* Contenido expandible */}
      {isExpanded && (
        <div className="flex flex-col gap-4 mt-8">
          <select
            className="border rounded-lg p-2 bg-gray-50 text-gray-800"
            value={selectedItem}
            onChange={(e) => setSelectedItem(e.target.value)}
          >
            <option value="">Selecciona un ítem económico</option>
            {items.map((item) => (
              <option key={item.code} value={item.code}>
                {item.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            className="border rounded-lg p-2 bg-gray-50 text-gray-800"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min="2024-01-01"
            max="2024-12-31"
          />

        </div>
      )}

      {/* Valor seleccionado */}
      {valor && (
        <div className="border-t pt-4 mt-4 text-slate-800">
          <p className="font-semibold">
            Ítem: {valor.name} ({valor.code})
          </p>
          <p className="font-bold text-xl text-slate-900">Valor: {valor.value}</p>
          <p className="text-sm text-slate-500">Fecha: {formatDate(valor.date)}</p>
        </div>
      )}
    </section>
  );
}
