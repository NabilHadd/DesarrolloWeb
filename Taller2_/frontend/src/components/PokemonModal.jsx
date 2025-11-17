import React, { useEffect, useState } from "react";
import AnimatedText from './AnimatedText';
import axios from 'axios';

const typeLabels = {
  fuego: 'Fuego',
  agua: 'Agua',
  planta: 'Planta',
  electrico: 'Eléctrico',
  veneno: 'Veneno',
  volador: 'Volador',
  dragon: 'Dragón',
  psiquico: 'Psíquico',
  hada: 'Hada',
  tierra: 'Tierra',
  acero: 'Acero',
  fantasma: 'Fantasma',
  lucha: 'Lucha',
  roca: 'Roca',
  siniestro: 'Siniestro',
};

export default function PokemonModal({ pokemonId, onClose, puerto }) {
  const [pokemon, setPokemon] = useState(null);
  const [tipos, setTipos] = useState([]);
  const [habilidades, setHabilidades] = useState([]);

  useEffect(() => {
    if (!pokemonId) return;

    // Obtener datos básicos
    axios.get(`http://localhost:9001/pokemon?id=${pokemonId}`)
      .then(res => setPokemon(res.data))
      .catch(err => console.error(err));

    // Obtener tipos
    axios.get(`http://localhost:9001/pokemon/tipos?id=${pokemonId}`)
      .then(res => setTipos(res.data.filter(Boolean)))
      .catch(err => console.error(err));

    // Obtener habilidades
    axios.get(`http://localhost:9001/pokemon/habilidades?id=${pokemonId}`)
      .then(res => setHabilidades(res.data.filter(Boolean)))
      .catch(err => console.error(err));
  }, [pokemonId, puerto]);

  if (!pokemon) return null; // Opcional: loader o spinner

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 modal-overlay"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto relative shadow-2xl modal-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-3xl font-bold"
          onClick={onClose}
        >
          ×
        </button>

        <AnimatedText
          as="h2"
          text={pokemon.name}
          isActive
          className="text-3xl font-bold text-center mb-6 underline capitalize"
          speed={12}
        />

        <img
          src={pokemon.sprite}
          alt={pokemon.name}
          className="w-64 mx-auto mb-6 animate-card"
        />

        <div className="bg-white rounded-lg p-6 shadow-lg space-y-6">
          {/* Tipos */}
          <div className="flex flex-wrap gap-3 justify-center">
            {tipos.map((tipo) => (
              <AnimatedText
                key={`tipo-${tipo.id}`}
                as="span"
                text={typeLabels[tipo.name] || tipo.name}
                isActive
                className="px-4 py-1 rounded-full bg-indigo-50 text-indigo-700 font-semibold capitalize"
                speed={10}
              />
            ))}
          </div>

          {/* Altura y peso */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <AnimatedText
                as="p"
                text="Altura"
                isActive
                className="text-gray-600 font-semibold"
                speed={10}
              />
              <AnimatedText
                as="p"
                text={`${pokemon.height ?? 0} m`}
                isActive
                className="text-xl font-bold text-blue-600"
                speed={10}
              />
            </div>
            <div className="text-center">
              <AnimatedText
                as="p"
                text="Peso"
                isActive
                className="text-gray-600 font-semibold"
                speed={10}
              />
              <AnimatedText
                as="p"
                text={`${pokemon.weight ?? 0} kg`}
                isActive
                className="text-xl font-bold text-green-600"
                speed={10}
              />
            </div>
          </div>

          {/* Habilidades */}
          <div>
            <AnimatedText
              as="h3"
              text="Habilidades"
              isActive
              className="text-xl font-bold text-center mb-3 text-purple-600"
              speed={12}
            />
            <ul className="list-disc list-inside bg-purple-50 rounded-lg p-4">
              {habilidades.map((hab) => (
                <AnimatedText
                  key={`hab-${hab.id}`}
                  as="li"
                  text={`${hab.name} - ${hab.effect}`}
                  isActive
                  className="text-gray-800 font-medium capitalize"
                  speed={10}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
