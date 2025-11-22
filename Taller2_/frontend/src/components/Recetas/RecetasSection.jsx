import { useEffect, useMemo, useState } from 'react';
import { ReactComponent as RecetasIcon } from '../icons/recetas.svg';
import { API_RECETAS } from '../api';
import { getRandomItems } from '../../utils/getRandomItems';
import AnimatedText from '../AnimatedText';
import RecetaModal from './RecetaModal';

const recipePlaceholder =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="320" height="200" viewBox="0 0 320 200"%3E%3Crect width="320" height="200" rx="16" fill="%23ede9fe"/%3E%3Cpath d="M60 90h200" stroke="%23c4b5fd" stroke-width="6" stroke-linecap="round"/%3E%3Cpath d="M60 120h120" stroke="%23c4b5fd" stroke-width="6" stroke-linecap="round"/%3E%3Ccircle cx="220" cy="120" r="18" fill="none" stroke="%23c4b5fd" stroke-width="6"/%3E%3Ctext x="50%25" y="55%25" text-anchor="middle" fill="%23938ef1" font-family="Inter,Arial" font-size="24" font-weight="600"%3EReceta%3C/text%3E%3C/svg%3E';

// Función de mapeo para adaptar el formato de la API al formato del frontend
const mapApiToFrontendFormat = (apiReceta) => {
  const ingredientes = [];
  // Itera hasta 20 ingredientes
  for (let i = 1; i <= 20; i++) {
    const ingredientKey = `strIngredient${i}`;
    const measureKey = `strMeasure${i}`;
    
    // Solo incluye el ingrediente si tiene nombre
    if (apiReceta[ingredientKey] && apiReceta[ingredientKey].trim()) {
      const medida = apiReceta[measureKey] || '';
      ingredientes.push(`${medida.trim()} ${apiReceta[ingredientKey].trim()}`);
    }
  }

  // Divide las instrucciones por salto de línea (\r\n) y filtra líneas vacías.
  const pasos = apiReceta.strInstructions 
    ? apiReceta.strInstructions.split('\r\n').filter(p => p.trim()) 
    : ['Instrucciones no disponibles.'];

  return {
    // Genera un ID (solo para fines de clave de lista)
    id: apiReceta.strMeal.replace(/\s/g, '-').toLowerCase(), 
    nombre: apiReceta.strMeal || 'Receta sin nombre',
    imagen: apiReceta.strMealThumb || recipePlaceholder,
    ingredientes: ingredientes, // Lista de ingredientes y medidas combinadas
    pasos: pasos, // Lista de pasos
  };
};

export default function RecetasSection({ isExpanded, onToggle, onCollapse }) {
  const [selectedReceta, setSelectedReceta] = useState(null);
  // Estados para manejar la carga de datos
  const [recetas, setRecetas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 1. Hook para la llamada a la API
  useEffect(() => {
    const fetchRecetas = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Asegúrate de que esta URL coincida con tu servidor FastAPI
        console.log(API_RECETAS)
        const response = await fetch(`${API_RECETAS}meals`); 
        if (!response.ok) {
          throw new Error('Error al cargar las recetas desde la API.');
        }
        
        const data = await response.json();
        // Mapea los datos antes de guardarlos en el estado
        const mappedData = data.map(mapApiToFrontendFormat);
        setRecetas(mappedData);
      } catch (err) {
        console.error("Fallo la obtención de recetas:", err);
        setError("No se pudieron cargar las recetas. Asegúrate de que FastAPI esté corriendo.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecetas();
  }, []); 

  // 2. Ahora usa las 'recetas' cargadas de la API
  const highlightedRecetas = useMemo(() => getRandomItems(recetas, 4), [recetas]);

  useEffect(() => {
    if (!isExpanded) {
      setSelectedReceta(null);
    }
  }, [isExpanded]);

  const closeModal = () => setSelectedReceta(null);

  return (
    <>
      <section className="w-full max-w-5xl mx-auto bg-white/95 rounded-2xl px-6 py-5 border border-amber-100 shadow-lg shadow-amber-500/10 transition-shadow animate-section-entry">
        {/* ... Botón de Toggle (sin cambios) ... */}
        <button
          type="button"
          onClick={onToggle}
          className="flex items-center justify-between gap-4 w-full text-left focus:outline-none hover:opacity-90 transition-opacity"
        >
          <div className="flex items-center gap-3">
            <span className="section-icon text-slate-900 w-10 h-10 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center shadow-inner shadow-white/60">
              <RecetasIcon className="w-6 h-6" />
            </span>
            <AnimatedText
              as="h2"
              text="Recetas de la API"
              isActive
              className="text-2xl font-bold text-amber-700"
              speed={14}
            />
          </div>
          <span className="hidden text-xs uppercase tracking-wide text-amber-700/70 font-semibold sm:inline-block">
            Panel interactivo
          </span>
        </button>

        {isExpanded && (
          <div className="mt-3 mb-3 md:mb-4">
             {/* Mostrar estados de carga y error */}
            {isLoading && (
              <p className="text-center text-lg text-amber-500 my-4">Cargando recetas...</p>
            )}

            {error && (
              <p className="text-center text-lg text-red-500 my-4 font-semibold">{error}</p>
            )}
            
            {/* 3. Mostrar las recetas solo si no hay carga y hay datos */}
            {!isLoading && recetas.length > 0 && (
              <>
                <AnimatedText
                  as="p"
                  text="Selecciona una receta para ver más detalles."
                  isActive={isExpanded}
                  className="text-center text-sm text-slate-700 mb-4 font-medium"
                  speed={12}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-3 md:mb-4">
                  {highlightedRecetas.map((receta, index) => (
                    <div
                      key={receta.id}
                      onClick={() => setSelectedReceta(receta)}
                      className={`bg-white rounded p-3 cursor-pointer hover:shadow-lg transition-shadow transform hover:scale-105 ${isExpanded ? 'animate-card' : ''}`}
                      style={isExpanded ? { animationDelay: `${index * 80}ms` } : undefined}
                    >
                      <img
                        src={receta.imagen}
                        alt={receta.nombre}
                        className="w-full h-28 object-cover rounded mb-2"
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src = recipePlaceholder;
                        }}
                      />
                      <AnimatedText
                        as="p"
                        text={receta.nombre}
                        isActive={isExpanded}
                        className="text-center font-bold text-slate-800 text-sm line-clamp-2"
                        speed={10}
                        delay={index * 40}
                      />
                    </div>
                  ))}
                </div>
              </>
            )}

            <button
              className="mx-auto block bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-6 rounded text-sm transition-colors"
              onClick={() => {
                onCollapse();
                setSelectedReceta(null);
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

      {/* RecetaModal usa el objeto 'receta' que ya está mapeado al formato correcto */}
      {selectedReceta && (
        <RecetaModal receta={selectedReceta} onClose={closeModal} />
      )}
    </>
  );
}