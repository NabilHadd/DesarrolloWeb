const integrantes = [
  { nombre: 'Nabil Haddad', rut: '21.427.760-4' },
  { nombre: 'Vincenzo Porzio', rut: '21.369.897-4' },
  { nombre: 'Nicolás Cordero', rut: '20.543.155-1' },
  { nombre: 'Diego Parga', rut: '21.621.105-7' },
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-gray-400 py-8 px-4 w-full border-t border-gray-700">
      <div className="max-w-5xl mx-auto">
        <h3 className="text-base font-bold text-center mb-4 text-white">
          Desarrollo Web/Móvil - Taller 2
        </h3>

        <div className="text-center mb-4">
          <h4 className="text-xs font-semibold text-blue-400 mb-2">Grupo 11 - Integrantes:</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {integrantes.map((integrante) => (
              <div key={integrante.nombre} className="text-xs">
                <span className="block font-semibold text-white">{integrante.nombre}</span>
                <span className="block text-xs text-gray-500">{integrante.rut}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mb-4 space-y-1 text-xs">
          <p>
            🌐{' '}
            <a
              href="https://nabilhadd.github.io/DesarrolloWeb/Taller1_/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-400"
            >
              Ver proyecto en GitHub Pages
            </a>
          </p>
          <p>
            💻{' '}
            <a
              href="https://github.com/NabilHadd/DesarrolloWeb"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-400"
            >
              Ver repositorio en GitHub
            </a>
          </p>
        </div>

        <div className="border-t border-gray-700 pt-3 text-center text-xs text-gray-500">
          <p>© 2025 - UCN - Desarrollo Web/Móvil</p>
        </div>
      </div>
    </footer>
  );
}
