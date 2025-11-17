const integrantes = [
  { nombre: 'Nabil Haddad', rut: '21.427.760-4' },
  { nombre: 'Vincenzo Porzio', rut: '21.369.897-4' },
  { nombre: 'Nicolás Cordero', rut: '20.543.155-1' },
  { nombre: 'Diego Parga', rut: '21.621.105-7' },
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-gray-300 py-8 px-4 w-full border-t border-gray-800">
      <div className="max-w-5xl mx-auto flex flex-col gap-6">
        <div className="text-center space-y-1">
          <h3 className="text-base font-bold text-white">
            Desarrollo Web/Móvil - Taller 2
          </h3>
          <p className="text-xs font-semibold text-blue-400 tracking-wide uppercase">
            Grupo 11 · Integrantes
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2 md:grid-cols-4">
          {integrantes.map((integrante) => (
            <div
              key={integrante.nombre}
              className="rounded-lg bg-slate-800/60 border border-slate-700 px-4 py-3 text-center sm:text-left"
            >
              <span className="block font-semibold text-white text-sm">
                {integrante.nombre}
              </span>
              <span className="block text-xs text-gray-400">{integrante.rut}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-2 text-xs sm:flex-row sm:justify-center sm:gap-6">
          <a
            href="https://github.com/NabilHadd/DesarrolloWeb"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300"
          >
            <span role="img" aria-hidden="true">💻</span>
            Ver repositorio en GitHub
          </a>
        </div>

        <div className="border-t border-gray-800 pt-3 text-center text-[11px] text-gray-500">
          <p>© 2025 · UCN · Desarrollo Web/Móvil</p>
        </div>
      </div>
    </footer>
  );
}
