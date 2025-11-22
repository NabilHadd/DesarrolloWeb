import React, { useEffect, useState } from "react";
import AnimatedText from '../AnimatedText';
import Habilidades from './Habilidades'
import {API_POKEMON} from '../api.js'
import axios from 'axios';


export default function PokemonModal({ pokemonId, onClose}) {
  const [pokemon, setPokemon] = useState(null);
  const [tipos, setTipos] = useState([]);
  const [habilidades, setHabilidades] = useState([]);

  useEffect(() => {
    if (!pokemonId) return;

    // Obtener datos básicos
    axios.get(`${API_POKEMON}pokemon?id=${pokemonId}`)
      .then(res => setPokemon(res.data))
      .catch(err => console.error(err));

    // Obtener tipos
    axios.get(`${API_POKEMON}pokemon/tipos?id=${pokemonId}`)
      .then(res => setTipos(res.data.filter(Boolean)))
      .catch(err => console.error(err));

    // Obtener habilidades
    axios.get(`${API_POKEMON}pokemon/habilidades?id=${pokemonId}`)
      .then(res => setHabilidades(res.data.filter(Boolean)))
      .catch(err => console.error(err));
  }, [pokemonId]);




if (!pokemon) {
  return (
    <div className="flex items-center justify-center w-full py-10">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="w-10 h-10 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>

        {/* Texto */}
        <p className="text-purple-600 font-semibold text-lg">
          Cargando Pokémon...
        </p>
      </div>
    </div>
  );
}



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
          className="text-3xl font-bold text-center text-indigo-700 mb-6 capitalize"
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
              <img src={tipo.sprite} alt={tipo.name}></img>
            ))}
          </div>

          {/* Altura y peso */}
          <div className="grid grid-cols-2 gap-4">
            {/* Altura */}
            <div className="bg-blue-50 rounded-2xl p-4 text-center shadow-sm border border-blue-200">
              <p className="text-sm font-semibold text-blue-700 tracking-wide">Altura</p>
              <p className="text-2xl font-extrabold text-blue-600 mt-1">
                {pokemon.height ?? 0} m
              </p>
            </div>

            {/* Peso */}
            <div className="bg-green-50 rounded-2xl p-4 text-center shadow-sm border border-green-200">
              <p className="text-sm font-semibold text-green-700 tracking-wide">Peso</p>
              <p className="text-2xl font-extrabold text-green-600 mt-1">
                {pokemon.weight ?? 0} kg
              </p>
            </div>
          </div>
          {/* Habilidades */}
            <Habilidades habilidades={habilidades}/>
        </div>
      </div>
    </div>
  );
}
