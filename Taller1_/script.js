// =================== CONTROL DE VISIBILIDAD DE SECCIONES ===================
// Array que controla si cada sección está visible (true) o oculta (false)
// Índices: 0=Noticias, 1=Recetas, 2=Pokémones, 3=Economía
const visibility = [false, false, false, false]

// =================== SISTEMA DE ANIMACIÓN DE TEXTO ===================
/**
 * Anima el texto de un elemento carácter por carácter (efecto máquina de escribir)
 * @param {HTMLElement} element - Elemento a animar
 * @param {number} delay - Tiempo en ms entre cada carácter
 */
function animateText(element, delay = 4) {
    // Si ya está animado, no hacer nada
    if (element.dataset.animated === 'true') return;
    
    // Guardar el texto original para poder restaurarlo después
    if (!element.dataset.originalText) {
        element.dataset.originalText = element.textContent;
    }
    
    const text = element.dataset.originalText;
    element.textContent = ''; // Limpiar el texto
    element.dataset.animated = 'true'; // Marcar como animado
    
    // Escribir carácter por carácter
    let i = 0;
    const timer = setInterval(() => {
        element.textContent = text.slice(0, i + 1);
        i++;
        if (i >= text.length) clearInterval(timer); // Parar cuando termine
    }, delay);
}

/**
 * Anima todos los elementos de texto dentro de un contenedor
 * @param {HTMLElement} container - Contenedor que contiene los elementos a animar
 * @param {number} delay - Tiempo en ms entre cada carácter
 */
function animateAllText(container = document, delay = 4) {
    // Si no se especifica contenedor, usar el body
    if (container === document) {
        container = document.body;
    }
    
    // Seleccionar todos los elementos de texto
    const textElements = container.querySelectorAll('h1, h2, h3, p, span, a, li, strong');
    textElements.forEach((el, index) => {
        // Solo animar elementos con texto que estén dentro del contenedor
        if (el.textContent.trim() && !el.dataset.animated && container.contains(el)) {
            // Delay escalonado para que no todos empiecen al mismo tiempo
            setTimeout(() => animateText(el, delay), index * 10);
        }
    });
}

// =================== CONFIGURACIÓN DE POKÉMONES ===================
// Diccionario para traducir tipos de pokémon de inglés a español
const pokemonTypes = {
    'normal': 'normal', 'fire': 'fuego', 'water': 'agua', 'electric': 'eléctrico',
    'grass': 'planta', 'ice': 'hielo', 'fighting': 'lucha', 'poison': 'veneno',
    'ground': 'tierra', 'flying': 'volador', 'psychic': 'psíquico', 'bug': 'bicho',
    'rock': 'roca', 'ghost': 'fantasma', 'dragon': 'dragón', 'dark': 'siniestro',
    'steel': 'acero', 'fairy': 'hada'
};

// Colores oficiales para cada tipo de pokémon
const pokemonTypeColors = {
    'normal': '#A8A878', 'fire': '#F08030', 'water': '#6890F0', 'electric': '#F8D030',
    'grass': '#78C850', 'ice': '#98D8D8', 'fighting': '#C03028', 'poison': '#A040A0',
    'ground': '#E0C068', 'flying': '#A890F0', 'psychic': '#F85888', 'bug': '#A8B820',
    'rock': '#B8A038', 'ghost': '#705898', 'dragon': '#7038F8', 'dark': '#705848',
    'steel': '#B8B8D0', 'fairy': '#EE99AC'
};

/**
 * Crea el HTML para mostrar un tipo de pokémon con su ícono y color
 * @param {string} type - Tipo de pokémon en inglés
 * @returns {string} HTML del tipo con ícono y estilo
 */
function createPokemonTypeWithIcon(type) {
    const translatedType = pokemonTypes[type] || type; // Traducir o usar original
    const color = pokemonTypeColors[type] || '#68A090'; // Color del tipo
    const iconPath = `iconos-tipos-pokemon/${type}.svg`; // Ruta del ícono SVG
    
    return `
        <span class="pokemon-type" style="
            display: inline-flex; 
            align-items: center; 
            margin: 0 4px; 
            color: ${color}; 
            font-weight: 600;
            font-size: 0.9em;
        ">
            <img src="${iconPath}" alt="${type}" style="
                width: 16px; 
                height: 16px; 
                margin-right: 4px;
                filter: none;
            " />
            ${translatedType}
        </span>
    `;
}

/**
 * Función básica para traducir ingredientes comunes de inglés a español
 * @param {string} text - Texto a traducir
 * @returns {string} Texto traducido
 */
function simpleTranslate(text) {
    // Diccionario de traducciones básicas
    const translations = {
        'chicken': 'pollo', 'beef': 'carne', 'pork': 'cerdo', 'fish': 'pescado',
        'onion': 'cebolla', 'garlic': 'ajo', 'tomato': 'tomate', 'pepper': 'pimiento',
        'salt': 'sal', 'sugar': 'azúcar', 'flour': 'harina', 'butter': 'mantequilla',
        'oil': 'aceite', 'water': 'agua', 'milk': 'leche', 'egg': 'huevo',
        'cheese': 'queso', 'rice': 'arroz', 'potato': 'papa', 'carrot': 'zanahoria'
    };
    
    let translated = text.toLowerCase();
    // Aplicar cada traducción
    Object.keys(translations).forEach(english => {
        translated = translated.replace(new RegExp(english, 'gi'), translations[english]);
    });
    
    return translated;
}

// =================== INICIALIZACIÓN DE LA PÁGINA ===================
// Ocultar todas las secciones de contenido al cargar la página
const contents = document.querySelectorAll(".content");
contents.forEach(content=> {
    content.style.display = 'none'
})

// =================== CONTROL DE EXPANSIÓN/COLAPSO DE SECCIONES ===================
// Obtener todos los botones de las secciones
const items = document.querySelectorAll('.button');

// Agregar evento click a cada botón
items.forEach(item => {
    item.addEventListener("click", () => {
        const container = item.parentElement.querySelector(".content"); // Contenido de la sección
        const dataContainer = item.parentElement; // Contenedor principal
        const sectionId = Number(item.id); // ID numérico de la sección

        // Si la sección ya está visible, ocultarla
        if(visibility[sectionId]){
            container.style.display = 'none';
            visibility[sectionId] = false;
            dataContainer.classList.remove('active');
            
            // Resetear animaciones de texto cuando se cierra
            container.querySelectorAll('[data-animated="true"]').forEach(el => {
                el.dataset.animated = 'false';
                if (el.dataset.originalText) {
                    el.textContent = el.dataset.originalText;
                }
            });
        } else {
            // Cerrar todas las otras secciones primero
            items.forEach((otherItem, index) => {
                if (otherItem !== item && visibility[index]) {
                    const otherContainer = otherItem.parentElement.querySelector(".content");
                    const otherDataContainer = otherItem.parentElement;
                    otherContainer.style.display = 'none';
                    visibility[index] = false;
                    otherDataContainer.classList.remove('active');
                    
                    // Resetear animaciones de otras secciones
                    otherContainer.querySelectorAll('[data-animated="true"]').forEach(el => {
                        el.dataset.animated = 'false';
                        if (el.dataset.originalText) {
                            el.textContent = el.dataset.originalText;
                        }
                    });
                }
            });
            
            // Mostrar la sección actual
            container.style.display = 'block'
            visibility[sectionId] = true;
            dataContainer.classList.add('active');
            
            // Resetear animaciones antes de iniciar nuevas
            container.querySelectorAll('[data-animated="true"]').forEach(el => {
                el.dataset.animated = 'false';
                if (el.dataset.originalText) {
                    el.textContent = el.dataset.originalText;
                }
            });
            
            // Animar texto cuando se expande una sección
            setTimeout(() => {
                animateAllText(container, 8);
            }, 50);
        }
    })
})

// =================== MODAL PARA NOTICIAS ===================
// Crear modal dinámicamente para mostrar detalles de noticias
const newsModal = document.createElement('div');
newsModal.id = 'news-modal';
// Configurar estilos del modal (posición fija, fondo oscuro, centrado)
newsModal.style.position = 'fixed';
newsModal.style.top = '0';
newsModal.style.left = '0';
newsModal.style.width = '100%';
newsModal.style.height = '100%';
newsModal.style.backgroundColor = 'rgba(0,0,0,0.7)';
newsModal.style.display = 'none';
newsModal.style.justifyContent = 'center';
newsModal.style.alignItems = 'center';
newsModal.style.zIndex = '1000';
newsModal.style.transition = 'opacity 0.3s ease';

// Crear contenido del modal
const newsModalContent = document.createElement('div');
// Aplicar degradado pastel como fondo
newsModalContent.style.background = 'linear-gradient(135deg, #ffeef0 0%, #fff8e1 50%, #f8f0ff 100%)';
newsModalContent.style.border = '1px solid rgba(255, 182, 193, 0.2)';
newsModalContent.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
newsModalContent.style.padding = '25px';
newsModalContent.style.borderRadius = '15px';
newsModalContent.style.maxWidth = '800px';
newsModalContent.style.width = '90%';
newsModalContent.style.maxHeight = '90%';
newsModalContent.style.overflowY = 'auto';
newsModalContent.style.textAlign = 'justify';
newsModalContent.style.position = 'relative';
newsModalContent.style.transition = 'transform 0.3s ease';

// Crear botón de cerrar
const newsModalClose = document.createElement('button');
newsModalClose.textContent = 'Cerrar';
newsModalClose.style.position = 'absolute';
newsModalClose.style.top = '10px';
newsModalClose.style.right = '10px';
newsModalClose.style.padding = '5px 10px';
newsModalClose.style.cursor = 'pointer';

// Ensamblar modal y agregarlo al DOM
newsModalContent.appendChild(newsModalClose);
newsModal.appendChild(newsModalContent);
document.body.appendChild(newsModal);

// Función para cerrar modal de noticias con animación
function closeNewsModal() {
    // Limpiar contenido (excepto botón cerrar)
    newsModalContent.querySelectorAll(':not(button):not(img)').forEach(el => el.remove());
    newsModal.style.opacity = '0';
    newsModalContent.style.transform = 'scale(0.95)';
    setTimeout(() => {
        newsModal.style.display = 'none';
        newsModal.style.opacity = '1';
        newsModalContent.style.transform = 'scale(1)';
    }, 300);
}

// Eventos para cerrar modal
newsModalClose.addEventListener('click', closeNewsModal);
newsModal.addEventListener('click', (e) => {
    if (e.target === newsModal) closeNewsModal(); // Cerrar al hacer click fuera
});

// =================== CONSUMO DE API DE NOTICIAS ===================
// Obtener noticias desde MediaStack API
fetch('https://api.mediastack.com/v1/news?access_key=819290bca7613b3a76cc88ba9164b393&languages=es')
  .then(response => response.json())
  .then(data => {
    const articles = Array.isArray(data.data) ? data.data : [];
    // Filtrar solo noticias que tengan imagen
    const articlesWithImage = articles.filter(article => article.image);
    let usedIndexes = []; // Para evitar repetir noticias
    
    // Procesar 4 noticias
    for (let i = 0; i < 4; i++) {
      if (articlesWithImage.length === 0) break;
      
      let idx;
      // Obtener índice aleatorio no repetido
      do {
        idx = Math.floor(Math.random() * articlesWithImage.length);
      } while (usedIndexes.includes(idx) && usedIndexes.length < articlesWithImage.length);
      
      if (usedIndexes.includes(idx) && usedIndexes.length >= articlesWithImage.length) break;
      usedIndexes.push(idx);
      
      const article = articlesWithImage[idx];
      const container = document.getElementById(`news_${i + 1}`);
      if (!container) continue;
      
      // Limpiar y configurar contenedor
      container.innerHTML = "";
      container.style.padding = "10px";
      container.style.overflow = "hidden";
      container.style.cursor = "pointer";
      container.style.transition = "transform 0.3s ease, box-shadow 0.3s ease";
      container.style.display = 'block';
      container.style.width = '100%';
      container.style.transform = "translateY(0)";
      
      // Agregar título de la noticia
      const title = document.createElement('p');
      title.textContent = article.title || "Sin título";
      container.appendChild(title);
      
      // Agregar imagen de la noticia
      const img = document.createElement('img');
      img.src = article.image;
      img.alt = article.title || "";
      img.style.maxWidth = "100%";
      container.appendChild(img);
      
      // Guardar datos adicionales en el elemento para el modal
      container.dataset.description = article.description || "";
      container.dataset.date = article.published_at || "";
      container.dataset.url = article.url || "";

      // Agregar efectos hover
      container.addEventListener('mouseenter', () => {
          container.style.transform = 'scale(1.03)';
          container.style.boxShadow = '0 6px 12px rgba(0,0,0,0.2)';
      });
      container.addEventListener('mouseleave', () => {
          container.style.transform = 'translateY(0)';
          container.style.boxShadow = 'none';
      });
    }
  })
  .catch(error => console.error('Error al obtener noticias:', error));

// =================== EVENTO PARA ABRIR MODAL DE NOTICIAS ===================
// Detectar clicks en contenedores de noticias
document.body.addEventListener('click', (e) => {
  const container = e.target.closest('[id^="news_"]'); // Buscar contenedor de noticia
  if (container && container.dataset.description !== undefined) {
    // Limpiar modal (mantener solo botón cerrar)
    Array.from(newsModalContent.children).forEach(child => {
      if (child !== newsModalClose) {
        newsModalContent.removeChild(child);
      }
    });

    // Crear y agregar elementos del modal
    // Título
    const title = document.createElement('p');
    title.textContent = container.querySelector('p') ? container.querySelector('p').textContent : "";
    title.style.fontWeight = 'bold';
    title.style.fontSize = '1.2em';
    title.style.marginBottom = '10px';
    newsModalContent.appendChild(title);

    // Imagen
    const modalImg = document.createElement('img');
    const originalImg = container.querySelector('img');
    if (originalImg) {
        modalImg.src = originalImg.src;
        modalImg.alt = originalImg.alt || "";
        modalImg.style.maxWidth = "100%";
        modalImg.style.marginBottom = "10px";
        newsModalContent.appendChild(modalImg);
    }

    // Descripción
    const desc = document.createElement('p');
    desc.textContent = container.dataset.description;
    desc.style.marginBottom = '10px';
    newsModalContent.appendChild(desc);

    // Fecha formateada
    const dateObj = new Date(container.dataset.date);
    const formattedDate = isNaN(dateObj) ? container.dataset.date : dateObj.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
    const dateP = document.createElement('p');
    dateP.textContent = `Fecha: ${formattedDate}`;
    dateP.style.marginBottom = '10px';
    newsModalContent.appendChild(dateP);

    // Enlace a noticia completa
    const link = document.createElement('a');
    link.href = container.dataset.url;
    link.textContent = "Leer más";
    link.target = "_blank";
    link.style.color = '#007BFF';
    link.style.textDecoration = 'none';
    link.style.fontWeight = 'bold';
    newsModalContent.appendChild(link);

    // Mostrar modal con animación
    newsModal.style.display = 'flex';
    newsModal.style.opacity = '0';
    newsModalContent.style.transform = 'scale(0.95)';
    setTimeout(() => {
        newsModal.style.opacity = '1';
        newsModalContent.style.transform = 'scale(1)';
        // Animar texto del modal
        animateAllText(newsModalContent, 5);
    }, 10);
  }
});

// =================== MODAL PARA POKÉMONES ===================
// Crear modal dinámicamente para mostrar detalles de pokémones
const pokemonModal = document.createElement('div');
pokemonModal.id = 'pokemon-modal';
// Configurar estilos (similar al modal de noticias)
pokemonModal.style.position = 'fixed';
pokemonModal.style.top = '0';
pokemonModal.style.left = '0';
pokemonModal.style.width = '100%';
pokemonModal.style.height = '100%';
pokemonModal.style.backgroundColor = 'rgba(0,0,0,0.7)';
pokemonModal.style.display = 'none';
pokemonModal.style.justifyContent = 'center';
pokemonModal.style.alignItems = 'center';
pokemonModal.style.zIndex = '1001';
pokemonModal.style.transition = 'opacity 0.3s ease';

// Crear contenido del modal con degradado azul pastel
const pokemonModalContent = document.createElement('div');
pokemonModalContent.style.background = 'linear-gradient(135deg, #e8f4fd 0%, #ffeef0 50%, #fff8e1 100%)';
pokemonModalContent.style.border = '1px solid rgba(173, 216, 230, 0.2)';
pokemonModalContent.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
pokemonModalContent.style.padding = '28px';
pokemonModalContent.style.borderRadius = '15px';
pokemonModalContent.style.maxWidth = '700px';
pokemonModalContent.style.width = '90%';
pokemonModalContent.style.maxHeight = '90%';
pokemonModalContent.style.overflowY = 'auto';
pokemonModalContent.style.textAlign = 'justify';
pokemonModalContent.style.position = 'relative';
pokemonModalContent.style.transition = 'transform 0.3s ease';

// Crear botón de cerrar
const pokemonModalClose = document.createElement('button');
pokemonModalClose.textContent = 'Cerrar';
pokemonModalClose.style.position = 'absolute';
pokemonModalClose.style.top = '10px';
pokemonModalClose.style.right = '10px';
pokemonModalClose.style.padding = '5px 10px';
pokemonModalClose.style.cursor = 'pointer';

// Ensamblar modal
pokemonModalContent.appendChild(pokemonModalClose);
pokemonModal.appendChild(pokemonModalContent);
document.body.appendChild(pokemonModal);

// Función para cerrar modal de pokémon
function closePokemonModal() {
    // Limpiar contenido (excepto botón cerrar)
    Array.from(pokemonModalContent.children).forEach(child => {
        if (child !== pokemonModalClose) {
            pokemonModalContent.removeChild(child);
        }
    });
    pokemonModal.style.opacity = '0';
    pokemonModalContent.style.transform = 'scale(0.95)';
    setTimeout(() => {
        pokemonModal.style.display = 'none';
        pokemonModal.style.opacity = '1';
        pokemonModalContent.style.transform = 'scale(1)';
    }, 300);
}

// Eventos para cerrar modal
pokemonModalClose.addEventListener('click', closePokemonModal);
pokemonModal.addEventListener('click', (e) => {
    if (e.target === pokemonModal) closePokemonModal();
});

// =================== CONSUMO DE API DE POKÉMONES ===================
// Obtener lista de pokémones desde PokéAPI
fetch('https://pokeapi.co/api/v2/pokemon?offset=20&limit=1000')
.then(res => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
})
.then(data => {
    // Procesar 4 pokémones aleatorios
    for (let index = 0; index < 4; index++) {
        const num = Math.floor(Math.random() * data.results.length);
        const pokemon_url = data.results[num].url;
        const container = document.getElementById(`pokemon_${index + 1}`);
        
        // Limpiar y configurar contenedor
        container.innerHTML = "";
        container.style.cursor = 'pointer';
        container.style.transition = "transform 0.3s ease, box-shadow 0.3s ease";
        
        // Agregar efectos hover
        container.addEventListener('mouseenter', () => {
            container.style.transform = 'scale(1.03)';
            container.style.boxShadow = '0 6px 12px rgba(0,0,0,0.2)';
        });
        container.addEventListener('mouseleave', () => {
            container.style.transform = 'none';
            container.style.boxShadow = 'none';
        });
        
        // Obtener datos detallados del pokémon
        fetch(pokemon_url)
        .then(res => {
            if(!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
        }).then(pokeData => {
            // Crear y agregar nombre del pokémon
            const p = document.createElement('p');
            p.textContent = pokeData.name.charAt(0).toUpperCase() + pokeData.name.slice(1);
            container.appendChild(p);
            
            // Crear y agregar imagen del pokémon
            const html_img = document.createElement('img');
            html_img.src = pokeData.sprites.front_default;
            html_img.alt = pokeData.name;
            html_img.style.maxWidth = "100%";
            container.appendChild(html_img);
            
            // Crear contenedor para tipos con íconos
            const typesContainer = document.createElement('div');
            typesContainer.style.textAlign = 'center';
            typesContainer.style.marginTop = '8px';
            typesContainer.style.fontSize = '0.85em';
            
            // Etiqueta "Tipos:"
            const typesLabel = document.createElement('span');
            typesLabel.textContent = 'Tipos: ';
            typesLabel.style.fontWeight = 'bold';
            typesLabel.style.color = '#333';
            typesContainer.appendChild(typesLabel);
            
            // Crear elemento para cada tipo con emoji
            pokeData.types.forEach(typeInfo => {
                console.log('Creando tipo:', typeInfo.type.name);
                
                const typeSpan = document.createElement('span');
                typeSpan.className = 'pokemon-type';
                typeSpan.style.cssText = `
                    display: inline-flex; 
                    align-items: center; 
                    margin: 0 4px; 
                    color: ${pokemonTypeColors[typeInfo.type.name] || '#68A090'}; 
                    font-weight: 600;
                    font-size: 0.9em;
                `;
                
                // Mapeo de tipos a emojis
                const emojiMap = {
                    'fire': '🔥', 'water': '💧', 'grass': '🌿', 'electric': '⚡',
                    'ice': '❄️', 'fighting': '👊', 'poison': '☠️', 'ground': '🌍',
                    'flying': '🕊️', 'psychic': '🔮', 'bug': '🐛', 'rock': '🪨',
                    'ghost': '👻', 'dragon': '🐉', 'dark': '🌙', 'steel': '⚔️',
                    'fairy': '🧚', 'normal': '⭐'
                };
                
                // Crear elemento para el emoji
                const icon = document.createElement('span');
                icon.textContent = emojiMap[typeInfo.type.name] || '❓';
                icon.style.cssText = `
                    font-size: 16px;
                    margin-right: 4px;
                `;
                
                console.log('Usando emoji para:', typeInfo.type.name);
                
                // Crear elemento para el texto del tipo
                const text = document.createElement('span');
                text.textContent = pokemonTypes[typeInfo.type.name] || typeInfo.type.name;
                
                // Ensamblar tipo completo
                typeSpan.appendChild(icon);
                typeSpan.appendChild(text);
                typesContainer.appendChild(typeSpan);
            });
            container.appendChild(typesContainer);
            
            // Guardar URL para obtener detalles en el modal
            container.dataset.pokemonUrl = pokemon_url;
            
            // Configurar event handler para este pokémon
            setupPokemonClickHandler(container);
        });
    }
})
.catch(err => console.error('Error:', err));

/**
 * Configura el event handler para cuando se hace click en un pokémon
 * @param {HTMLElement} container - Contenedor del pokémon
 */
function setupPokemonClickHandler(container) {
    container.addEventListener('click', (e) => {
        // Verificar que el contenedor tenga datos de pokémon
        if (container.dataset.pokemonUrl) {
            // Limpiar modal (mantener solo botón cerrar)
            Array.from(pokemonModalContent.children).forEach(child => {
                if (child !== pokemonModalClose) {
                    pokemonModalContent.removeChild(child);
                }
            });
            
            // Cargar datos completos del pokémon
            fetch(container.dataset.pokemonUrl)
            .then(res => res.json())
            .then(pokeData => {
                // Crear nombre estilizado
                const name = document.createElement('h2');
                name.textContent = pokeData.name.charAt(0).toUpperCase() + pokeData.name.slice(1);
                name.style.cssText = `
                    font-weight: 700;
                    font-size: 2rem;
                    text-align: center;
                    margin-bottom: 20px;
                    color: #2d3748;
                    text-transform: capitalize;
                `;
                pokemonModalContent.appendChild(name);
                
                // Crear imagen más grande y centrada
                const img = document.createElement('img');
                img.src = pokeData.sprites.front_default;
                img.alt = pokeData.name;
                img.style.cssText = `
                    max-width: 300px;
                    width: 60%;
                    display: block;
                    margin: 0 auto 25px auto;
                    border-radius: 10px;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                `;
                pokemonModalContent.appendChild(img);
                
                // Crear sección de tipos con íconos
                const types = document.createElement('p');
                types.style.cssText = `
                    margin-bottom: 20px;
                    text-align: center;
                    font-size: 1.1rem;
                `;
                
                const typesLabel = document.createElement('strong');
                typesLabel.textContent = 'Tipo(s): ';
                typesLabel.style.color = '#4a5568';
                types.appendChild(typesLabel);
                
                // Agregar cada tipo con emoji
                pokeData.types.forEach((typeInfo, index) => {
                    if (index > 0) {
                        const separator = document.createElement('span');
                        separator.textContent = ', ';
                        types.appendChild(separator);
                    }
                    
                    const typeSpan = document.createElement('span');
                    typeSpan.style.cssText = `
                        display: inline-flex; 
                        align-items: center; 
                        margin: 0 2px;
                        color: ${pokemonTypeColors[typeInfo.type.name] || '#68A090'}; 
                        font-weight: 600;
                    `;
                    
                    // Mapeo de emojis para el modal
                    const emojiMap = {
                        'fire': '🔥', 'water': '💧', 'grass': '🌿', 'electric': '⚡',
                        'ice': '❄️', 'fighting': '👊', 'poison': '☠️', 'ground': '🌍',
                        'flying': '🕊️', 'psychic': '🔮', 'bug': '🐛', 'rock': '🪨',
                        'ghost': '👻', 'dragon': '🐉', 'dark': '🌙', 'steel': '⚔️',
                        'fairy': '🧚', 'normal': '⭐'
                    };
                    
                    const icon = document.createElement('span');
                    icon.textContent = emojiMap[typeInfo.type.name] || '❓';
                    icon.style.cssText = `
                        font-size: 18px;
                        margin-right: 4px;
                    `;
                    
                    console.log('Modal - Usando emoji para:', typeInfo.type.name);
                    
                    const text = document.createElement('span');
                    text.textContent = pokemonTypes[typeInfo.type.name] || typeInfo.type.name;
                    
                    typeSpan.appendChild(icon);
                    typeSpan.appendChild(text);
                    types.appendChild(typeSpan);
                });
                
                pokemonModalContent.appendChild(types);
                
                // Crear sección de habilidades
                const abilities = document.createElement('p');
                abilities.innerHTML = "<strong>Habilidades:</strong> " + pokeData.abilities.map(a => a.ability.name).join(', ');
                abilities.style.cssText = `
                    margin-bottom: 18px;
                    text-align: center;
                    font-size: 1.05rem;
                    color: #4a5568;
                `;
                pokemonModalContent.appendChild(abilities);
                
                // Crear sección de medidas (altura y peso)
                const measures = document.createElement('p');
                measures.innerHTML = `<strong>Altura:</strong> ${(pokeData.height/10).toFixed(1)} m &nbsp;&nbsp; <strong>Peso:</strong> ${(pokeData.weight/10).toFixed(1)} kg`;
                measures.style.cssText = `
                    margin-bottom: 25px;
                    text-align: center;
                    font-size: 1.05rem;
                    color: #4a5568;
                    background: rgba(74, 85, 104, 0.1);
                    padding: 12px;
                    border-radius: 8px;
                `;
                pokemonModalContent.appendChild(measures);
                
                // Crear título de estadísticas
                const statsTitle = document.createElement('p');
                statsTitle.innerHTML = '<strong>Estadísticas:</strong>';
                statsTitle.style.cssText = `
                    font-size: 1.2rem;
                    margin-bottom: 15px;
                    text-align: center;
                    color: #2d3748;
                    font-weight: 600;
                `;
                pokemonModalContent.appendChild(statsTitle);
                
                // Crear lista de estadísticas
                const stats = document.createElement('ul');
                stats.style.cssText = `
                    list-style-type: disc;
                    padding-left: 30px;
                    margin-bottom: 20px;
                    text-align: left;
                    max-width: 400px;
                    margin-left: auto;
                    margin-right: auto;
                `;
                
                // Agregar cada estadística
                pokeData.stats.forEach(stat => {
                    const li = document.createElement('li');
                    li.innerHTML = `<strong>${stat.stat.name}:</strong> ${stat.base_stat}`;
                    li.style.cssText = `
                        margin-bottom: 8px;
                        font-size: 1rem;
                        color: #4a5568;
                    `;
                    stats.appendChild(li);
                });
                
                pokemonModalContent.appendChild(stats);
                
                // Centrar contenido del modal
                pokemonModalContent.style.textAlign = 'center';
                
                // Mostrar modal con animación
                pokemonModal.style.display = 'flex';
                pokemonModal.style.opacity = '0';
                pokemonModalContent.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    pokemonModal.style.opacity = '1';
                    pokemonModalContent.style.transform = 'scale(1)';
                    // Animar texto del modal
                    animateAllText(pokemonModalContent, 6);
                }, 10);
            });
        }
    });
}

// =================== CONSUMO DE API DE RECETAS ===================
// Obtener recetas desde TheMealDB API
fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=')
    .then(res => {
        if(!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
    })
    .then(data => {
        const meals = data.meals;
        let nums = [] // Array para evitar recetas repetidas
        
        // Procesar 4 recetas
        for (let index = 0; index<4; index++) {
            const num = Math.floor(Math.random()*meals.length);
            // Si el número ya se usó, reintentar
            if(nums.includes(num)) {
                index--;
                continue;
            }
            nums.push(num)
            const meal = meals[num];

            const container = document.getElementById(`meal_${index +1}`);
            // Configurar estilos y eventos del contenedor
            container.style.cursor = 'pointer';
            container.style.transition = "transform 0.3s ease, box-shadow 0.3s ease";
            
            // Agregar efectos hover
            container.addEventListener('mouseenter', () => {
                container.style.transform = 'scale(1.03)';
                container.style.boxShadow = '0 6px 12px rgba(0,0,0,0.2)';
            });
            container.addEventListener('mouseleave', () => {
                container.style.transform = 'none';
                container.style.boxShadow = 'none';
            });

            // Crear y agregar nombre de la receta
            const mealname = document.createElement('p');
            mealname.textContent = meal.strMeal;
            container.appendChild(mealname);
            
            // Crear imagen de la receta
            const img = document.createElement('img');
            img.src = meal.strMealThumb;
            img.alt = meal.strMeal;

            // Guardar datos de la receta en el elemento imagen
            img.dataset.name = meal.strMeal;
            img.dataset.instructions = meal.strInstructions;

            // Procesar ingredientes (hasta 20 posibles)
            let ingredients = [];
            for (let i = 1; i<= 20; i++) {
                const ingredient = meal[`strIngredient${i}`];
                const measure = meal[`strMeasure${i}`];
                if (ingredient && ingredient.trim()!=="") {
                    ingredients.push(`${measure} ${ingredient}`);
                }
            }
            img.dataset.ingredients = JSON.stringify(ingredients);
            img.dataset.img = meal.strMealThumb;
            container.appendChild(img);
            
            // Configurar event handler para esta receta
            setupRecipeClickHandler(container, img);
        }
    })
    .catch(err=> console.error('Error:' , err));

// =================== CONFIGURACIÓN DEL MODAL DE RECETAS ===================
// Obtener elementos del modal de recetas (ya definidos en HTML)
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalIngredients = document.getElementById('modal-ingredients');
const modalImg = document.getElementById('modal-img');
const modalSteps = document.getElementById('modal-steps');
const closeBtn = document.getElementById('close');

// Agregar transiciones suaves al modal
modal.style.transition = 'opacity 0.3s ease';
if (modal.firstElementChild) {
    modal.firstElementChild.style.transition = 'transform 0.3s ease';
}

/**
 * Configura el event handler para cuando se hace click en una receta
 * @param {HTMLElement} container - Contenedor de la receta
 * @param {HTMLElement} img - Elemento imagen que contiene los datos
 */
function setupRecipeClickHandler(container, img) {
    container.addEventListener('click', (e) => {
        // Verificar que el elemento tenga datos de receta
        if (img.dataset.name) {
            // Limpiar animaciones previas del modal
            const modalContent = modal.querySelector('.modal-content');
            if (modalContent) {
                modalContent.querySelectorAll('[data-animated="true"]').forEach(el => {
                    el.dataset.animated = 'false';
                    if (el.dataset.originalText) {
                        el.textContent = el.dataset.originalText;
                    }
                });
            }

            // Llenar contenido del modal
            modalTitle.textContent = img.dataset.name;
            modalImg.src = img.dataset.img;
            modalImg.alt = img.dataset.name;

            // Mostrar ingredientes como lista
            const ingredients = JSON.parse(img.dataset.ingredients);
            modalIngredients.innerHTML = ingredients.map(i => `<li>${i}</li>`).join("");

            // Procesar y mostrar instrucciones como pasos numerados
            const instructions = img.dataset.instructions;
            // Dividir instrucciones en pasos (por puntos o números)
            const steps = instructions.split(/\d+\.|\.|;/).filter(step => step.trim().length > 10);
            modalSteps.innerHTML = steps.map((step, index) => `<li><strong>Step ${index + 1}:</strong> ${step.trim()}</li>`).join("");

            // Mostrar modal con animación de entrada
            modal.style.display = 'flex';
            modal.style.opacity = '0';
            if (modal.firstElementChild) {
                modal.firstElementChild.style.transform = 'scale(0.95)';
            }
            setTimeout(() => {
                modal.style.opacity = '1';
                if (modal.firstElementChild) {
                    modal.firstElementChild.style.transform = 'scale(1)';
                }
                // Animar texto del modal de recetas
                const modalContent = modal.querySelector('.modal-content');
                if (modalContent) {
                    animateAllText(modalContent, 1);
                }
            }, 10);
        }
    });
}

// =================== EVENTOS PARA CERRAR MODAL DE RECETAS ===================
// Cerrar modal con botón X
closeBtn.addEventListener('click', () => {
    // Limpiar animaciones
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) {
        modalContent.querySelectorAll('[data-animated="true"]').forEach(el => {
            el.dataset.animated = 'false';
            if (el.dataset.originalText) {
                el.textContent = el.dataset.originalText;
            }
        });
    }
    
    // Animación de salida
    modal.style.opacity = '0';
    if (modal.firstElementChild) {
        modal.firstElementChild.style.transform = 'scale(0.95)';
    }
    setTimeout(() => {
        modal.style.display = 'none';
        modal.style.opacity = '1';
        if (modal.firstElementChild) {
            modal.firstElementChild.style.transform = 'scale(1)';
        }
    }, 300);
});

// Cerrar modal al hacer click fuera de él
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        // Limpiar animaciones
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.querySelectorAll('[data-animated="true"]').forEach(el => {
                el.dataset.animated = 'false';
                if (el.dataset.originalText) {
                    el.textContent = el.dataset.originalText;
                }
            });
        }
        
        // Animación de salida
        modal.style.opacity = '0';
        if (modal.firstElementChild) {
            modal.firstElementChild.style.transform = 'scale(0.95)';
        }
        setTimeout(() => {
            modal.style.display = 'none';
            modal.style.opacity = '1';
            if (modal.firstElementChild) {
                modal.firstElementChild.style.transform = 'scale(1)';
            }
        }, 300);
    }
});

// =================== CONFIGURACIÓN PARA DATOS ECONÓMICOS ===================
// Obtener contenedor para datos económicos
const economia = document.querySelector('[data-container="economia"]');
const economia_content = economia.querySelector('.grid');
console.log(economia_content)

// =================== CONSUMO DE API DE DATOS ECONÓMICOS ===================
// Obtener indicadores económicos de Chile desde Findic API
fetch('https://findic.cl/api/')
.then(res => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json(); // o res.text(), res.blob()
})
.then(data => {
    const llaves = Object.keys(data); // Obtener todas las claves
    const date = data.fecha // Fecha de los datos
    // Tomar solo 16 items para organización en matriz (4x4 desktop, 8x2 tablet, 16x1 móvil)
    const names = llaves.slice(3, 19);
    
    // Mapear datos de interés
    const items = names.map(n => ({
        codigo: data[n].codigo,
        nombre: data[n].nombre,
        valor: data[n].valor,
        fecha: data[n].fecha
    }));

    // Crear elementos HTML para cada indicador económico
    items.map(i=> {
        const div = document.createElement('div');
        div.id = i.codigo;
        div.classList.add('rounded', 'lg');
        div.style.cursor = 'pointer';
        div.style.transition = "transform 0.3s ease, box-shadow 0.3s ease";
        
        // Agregar efectos hover
        div.addEventListener('mouseenter', () => {
            div.style.transform = 'scale(1.03)';
            div.style.boxShadow = '0 6px 12px rgba(0,0,0,0.2)';
        });
        div.addEventListener('mouseleave', () => {
            div.style.transform = 'none';
            div.style.boxShadow = 'none';
        });
        
        // Crear elemento para nombre del indicador
        const pNombre = document.createElement('p');
        pNombre.textContent = i.nombre;
        div.appendChild(pNombre);

        // Crear elemento para valor del indicador
        const pValor = document.createElement('p');
        pValor.textContent = i.valor;
        div.appendChild(pValor);

        // Crear elemento para fecha del indicador
        const pFecha = document.createElement('p');
        pFecha.textContent = i.fecha;
        div.appendChild(pFecha);
        
        // Agregar al grid
        economia_content.appendChild(div);
    });

    console.log(items);
})
.catch(err => console.error('Error:', err));

// =================== ANIMACIONES INICIALES ===================
// Ejecutar animaciones cuando se carga el DOM
document.addEventListener('DOMContentLoaded', () => {
    // Animar título principal primero
    setTimeout(() => {
        animateText(document.getElementById('titulo-principal'), 10);
    }, 100);
    
    // Animar títulos de secciones con delay escalonado
    setTimeout(() => {
        document.querySelectorAll('h2.button').forEach((el, i) => {
            setTimeout(() => animateText(el, 8), i * 50);
        });
    }, 300);
});
