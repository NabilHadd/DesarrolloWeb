import React, { useEffect, useState } from "react";
import AnimatedText from "../AnimatedText";
import { ReactComponent as EconomiaIcon } from "../icons/economia.svg";
import axios from "axios";
import { API_ECONOMIA } from "../api";

export default function SectionEconomia({ isExpanded, onToggle, onCollapse }) {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [item_nombre, setItem_Nombre] = useState("");
  const [valor, setValor] = useState(null);

  const formatDate = (isoString) => (isoString ? isoString.split("T")[0] : "");

  // Obtener indicadores al montar
  useEffect(() => {
    axios
      .get(`${API_ECONOMIA}/indicator`)
      .then((res) => setItems(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Obtener valor según selección
  useEffect(() => {
    if (!selectedItem || !selectedDate) return;

    axios
      .get(`${API_ECONOMIA}/indicator/${selectedItem}/${selectedDate}`)
      .then((res) => setValor(res.data))
      .catch((err) => console.error(err));

    axios
      .get(`${API_ECONOMIA}/indicator/${selectedItem}`)
      .then((res) => setItem_Nombre(res.data))
      .catch((err) => console.error(err));
  }, [selectedItem, selectedDate]);

  return (
    <section className="w-full max-w-5xl mx-auto bg-white/95 rounded-2xl px-6 py-5 border border-green-100 shadow-lg shadow-green-500/10 transition-shadow animate-section-entry">
      
      {/* Encabezado del panel */}
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center justify-between gap-4 w-full text-left focus:outline-none hover:opacity-90 transition-opacity"
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

        <span className="hidden text-xs uppercase tracking-wide text-green-700 font-semibold sm:inline-block">
          Panel interactivo
        </span>
      </button>

      {/* Contenido expandible */}
      {isExpanded && (
        <div className="flex flex-col gap-4 mt-8">

          {/* Select items */}
          <select
            className="border rounded-lg p-2 bg-gray-50 text-gray-800"
            value={selectedItem}
            onChange={(e) => setSelectedItem(e.target.value)}
          >
            <option value="">Selecciona un ítem económico</option>
            {items.map((item) => (
              <option key={item} value={item} className="text-gray-800">
                {item}
              </option>
            ))}
          </select>

          {/* Fecha */}
          <input
            type="date"
            className="border rounded-lg p-2 bg-gray-50 text-gray-800"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min="2024-01-01"
            max="2024-12-31"
          />

          {/* Resultado */}
          {valor && (
            <div className="border-t pt-4 mt-4 text-slate-800">
              <p className="font-semibold">
                Ítem: {item_nombre.name} ({valor.indicator_code})
              </p>
              <p className="font-bold text-xl text-slate-900">
                Valor: {valor.value}
              </p>
              <p className="text-sm text-slate-500">
                Fecha: {formatDate(valor.date)}
              </p>
            </div>
          )}

          {/* Botón cerrar */}
          <button
            className="mx-auto block bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded text-sm transition-colors"
            onClick={onCollapse}
          >
            <AnimatedText
              as="span"
              text="Cerrar"
              isActive={isExpanded}
              speed={14}
            />
          </button>

        </div>
      )}
    </section>
  );
}
