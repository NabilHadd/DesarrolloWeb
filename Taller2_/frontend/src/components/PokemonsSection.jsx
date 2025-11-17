import { useEffect, useMemo, useState } from 'react';
import { ReactComponent as PokemonsIcon } from '../icons/pokemons.svg';
import { mockPokemons } from '../mocks/data';
import { getRandomItems } from '../utils/getRandomItems';
import AnimatedText from './AnimatedText';
import PokemonModal from './PokemonModal';

export default function PokemonsSection({ isExpanded, onToggle, onCollapse }) {
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const destacados = useMemo(() => getRandomItems(mockPokemons, 4), []);

  useEffect(() => {
    if (!isExpanded) {
      setSelectedPokemon(null);
    }
  }, [isExpanded]);

  const closeModal = () => setSelectedPokemon(null);

  const typeColors = {
    fuego: 'bg-orange-100 text-orange-700',
    agua: 'bg-blue-100 text-blue-700',
    planta: 'bg-emerald-100 text-emerald-700',
    electrico: 'bg-yellow-100 text-yellow-700',
    veneno: 'bg-purple-100 text-purple-700',
    volador: 'bg-indigo-100 text-indigo-700',
    dragon: 'bg-pink-100 text-pink-700',
    psiquico: 'bg-fuchsia-100 text-fuchsia-700',
    hada: 'bg-rose-100 text-rose-700',
    tierra: 'bg-amber-100 text-amber-700',
    acero: 'bg-gray-100 text-gray-700',
    fantasma: 'bg-violet-100 text-violet-700',
    lucha: 'bg-red-100 text-red-700',
    roca: 'bg-stone-100 text-stone-700',
    siniestro: 'bg-slate-200 text-slate-800',
  };

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

  return (
    <>
      <section className="w-full max-w-5xl mx-auto bg-white/95 rounded-2xl px-6 py-5 border border-indigo-100 shadow-lg shadow-indigo-500/10 transition-shadow animate-section-entry">
        <button
          type="button"
          onClick={onToggle}
          className="flex items-center justify-between gap-4 w-full text-left focus:outline-none hover:opacity-90 transition-opacity"
        >
          <div className="flex items-center gap-3">
            <span className="section-icon text-slate-900 w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-inner shadow-white/60">
              <PokemonsIcon className="w-6 h-6" />
            </span>
            <AnimatedText
              as="h2"
              text="Pokemones"
              isActive
              className="text-2xl font-bold text-indigo-700"
              speed={14}
            />
          </div>
          <span className="hidden text-xs uppercase tracking-wide text-indigo-700/70 font-semibold sm:inline-block">
            Panel interactivo
          </span>
        </button>

        {isExpanded && (
          <div className="mt-3 mb-3 md:mb-4">
            <AnimatedText
              as="p"
              text="Haz clic en un Pokémon para ver detalles completos."
              isActive={isExpanded}
              className="text-center text-sm font-medium mb-4 text-slate-700"
              speed={12}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {destacados.map((pokemon, index) => (
                <div
                  key={pokemon.id}
                  className={`bg-white rounded p-3 cursor-pointer hover:shadow-lg transition-shadow transform hover:scale-105 ${isExpanded ? 'animate-card' : ''}`}
                  style={isExpanded ? { animationDelay: `${index * 80}ms` } : undefined}
                  onClick={() => setSelectedPokemon(pokemon)}
                >
                  <img
                    src={pokemon.imagen}
                    alt={pokemon.nombre}
                    className="w-full h-28 object-contain rounded mb-2"
                  />
                  <AnimatedText
                    as="p"
                    text={pokemon.nombre}
                    isActive={isExpanded}
                    className="text-center text-sm font-bold text-slate-800 mb-2"
                    speed={10}
                    delay={index * 40}
                  />
                  <div className="flex flex-wrap justify-center gap-1">
                    {pokemon.tipos.map((tipo) => (
                      <AnimatedText
                        key={`${pokemon.id}-${tipo}`}
                        as="span"
                        text={typeLabels[tipo] || tipo}
                        isActive={isExpanded}
                        className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold ${typeColors[tipo] || 'bg-gray-100 text-gray-700'}`}
                        speed={9}
                        delay={index * 40}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              className="mx-auto block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded text-sm transition-colors"
              onClick={() => {
                onCollapse();
                setSelectedPokemon(null);
              }}
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

      {selectedPokemon && (
        <PokemonModal pokemon={selectedPokemon} onClose={closeModal} />
      )}
    </>
  );
}
