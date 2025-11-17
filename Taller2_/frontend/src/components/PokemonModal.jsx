import AnimatedText from './AnimatedText';

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

export default function PokemonModal({ pokemon, onClose }) {
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
          text={pokemon.nombre}
          isActive
          className="text-3xl font-bold text-center mb-6 underline capitalize"
          speed={12}
        />

        <img
          src={pokemon.imagen}
          alt={pokemon.nombre}
          className="w-64 mx-auto mb-6 animate-card"
        />

        <div className="bg-white rounded-lg p-6 shadow-lg space-y-6">
          <div className="flex flex-wrap gap-3 justify-center">
            {pokemon.tipos.map((tipo) => (
              <AnimatedText
                key={`${pokemon.id}-modal-${tipo}`}
                as="span"
                text={typeLabels[tipo] || tipo}
                isActive
                className="px-4 py-1 rounded-full bg-indigo-50 text-indigo-700 font-semibold capitalize"
                speed={10}
                delay={pokemon.tipos.indexOf(tipo) * 60}
              />
            ))}
          </div>

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
                text={`${pokemon.altura} m`}
                isActive
                className="text-xl font-bold text-blue-600"
                speed={10}
                delay={50}
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
                text={`${pokemon.peso} kg`}
                isActive
                className="text-xl font-bold text-green-600"
                speed={10}
                delay={50}
              />
            </div>
          </div>

          <div>
            <AnimatedText
              as="h3"
              text="Habilidades"
              isActive
              className="text-xl font-bold text-center mb-3 text-purple-600"
              speed={12}
            />
            <ul className="list-disc list-inside bg-purple-50 rounded-lg p-4">
              {pokemon.habilidades.map((habilidad, index) => (
                <AnimatedText
                  key={`${pokemon.id}-ability-${habilidad}`}
                  as="li"
                  text={habilidad}
                  isActive
                  className="text-gray-800 font-medium capitalize"
                  speed={10}
                  delay={index * 40}
                />
              ))}
            </ul>
          </div>

          <div>
            <AnimatedText
              as="h3"
              text="Estadísticas"
              isActive
              className="text-xl font-bold text-center mb-3 text-blue-600"
              speed={12}
            />
            <div className="space-y-2">
              {Object.entries(pokemon.estadisticas).map(([stat, value]) => (
                <div key={stat} className="flex items-center">
                  <AnimatedText
                    as="span"
                    text={`${stat}:`}
                    isActive
                    className="w-24 capitalize font-semibold text-gray-700"
                    speed={10}
                  />
                  <div className="flex-1 bg-gray-200 rounded-full h-4 ml-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all"
                      style={{ width: `${Math.min((value / 150) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <AnimatedText
                    as="span"
                    text={String(value)}
                    isActive
                    className="ml-2 font-bold text-gray-800"
                    speed={10}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
