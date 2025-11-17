import { useEffect, useState } from 'react';
import { ReactComponent as PokemonsIcon } from '../icons/pokemons.svg';
import AnimatedText from './AnimatedText';
import PokemonModal from './PokemonModal';

export default function PokemonsSection({ isExpanded, onToggle, onCollapse}) {
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [destacados, setDestacados] = useState([]);


  useEffect(() => {
    if (isExpanded) {
      // Genera 4 IDs aleatorios entre 1 y 100
      const randomIds = Array.from({ length: 4 }, () =>
        Math.floor(Math.random() * 100) + 1
      );
      setDestacados(randomIds);
    } else {
      setSelectedPokemon(null);
    }
  }, [isExpanded]);

  const closeModal = () => setSelectedPokemon(null);

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
              {destacados.map((id, index) => (
                <div
                  key={id}
                  className={`bg-white rounded p-3 cursor-pointer hover:shadow-lg transition-shadow transform hover:scale-105`}
                  onClick={() => setSelectedPokemon(id)}
                >
                  <div className="w-full h-28 flex items-center justify-center bg-gray-50 rounded mb-2">
                    <span className="text-gray-400 text-sm">Pokémon {id}</span>
                  </div>
                  <AnimatedText
                    as="p"
                    text={`#${id}`}
                    isActive={isExpanded}
                    className="text-center text-sm font-bold text-slate-800 mb-2"
                    speed={10}
                    delay={index * 40}
                  />
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
        <PokemonModal pokemonId={selectedPokemon} onClose={closeModal} />
      )}
    </>
  );
}
