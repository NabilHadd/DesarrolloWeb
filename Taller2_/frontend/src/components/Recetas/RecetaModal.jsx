import AnimatedText from '../AnimatedText';

export default function RecetaModal({ receta, onClose }) {
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 modal-overlay"
      onClick={onClose}
    >
      <div 
        className="bg-gradient-to-br from-yellow-50 via-blue-50 to-pink-50 rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto relative shadow-2xl modal-panel"
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
          text={receta.nombre}
          isActive
          className="text-3xl font-bold text-center mb-6 text-blue-600"
          speed={12}
        />

        <img
          src={receta.imagen}
          alt={receta.nombre}
          className="w-96 max-w-[90%] mx-auto rounded-lg shadow-lg mb-6 animate-card"
        />

      <AnimatedText
        as="h3"
        text="Ingredientes"
        isActive
        className="text-2xl font-bold text-center text-blue-600 mb-4"
        speed={12}
      />

      <ul className="bg-gray-50 rounded-lg p-4 mb-6 max-w-3xl mx-auto border-l-4 border-blue-500 flex flex-col gap-2">
        {receta.ingredientes.map((ingrediente, index) => (
          <li
            key={`${receta.id}-ingredient-${index}`}
            className="w-full block bg-white/60 rounded-md px-3 py-2 shadow-sm"
          >
            {/* AnimatedText solo para animar el texto; no para el layout */}
            <AnimatedText
              as="span"
              text={ingrediente}
              isActive
              className="font-medium text-gray-800 block w-full"
              speed={10}
              delay={index * 40}
            />
          </li>
        ))}
      </ul>



        <AnimatedText
          as="h3"
          text="Pasos de Preparación"
          isActive
          className="text-2xl font-bold text-center text-green-600 mb-4"
          speed={12}
        />
        <ol className="list-decimal list-inside bg-green-50 rounded-lg p-4 max-w-2xl mx-auto border-l-4 border-green-500">
          {receta.pasos.map((paso, index) => (
            <li key={index} className="my-3 leading-relaxed text-gray-800">
              <span className="text-green-600 font-semibold mr-2">Paso {index + 1}:</span>
              <AnimatedText
                as="span"
                text={paso}
                isActive
                className="inline-block"
                speed={10}
                delay={index * 45}
              />
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
