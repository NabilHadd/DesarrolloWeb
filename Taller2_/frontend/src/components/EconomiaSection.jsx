import { ReactComponent as EconomiaIcon } from '../icons/economia.svg';
import { mockEconomia } from '../mocks/data';
import AnimatedText from './AnimatedText';

const pesoFormatter = new Intl.NumberFormat('es-CL', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const pesoNoDecimalsFormatter = new Intl.NumberFormat('es-CL', {
  maximumFractionDigits: 0,
});

const percentFormatter = new Intl.NumberFormat('es-CL', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const formatValue = (item) => {
  switch (item.simbolo) {
    case '%':
      return `${percentFormatter.format(item.valor)}%`;
    case 'US$/lb':
      return `US$ ${pesoFormatter.format(item.valor)}/lb`;
    case 'US$/t':
      return `US$ ${pesoNoDecimalsFormatter.format(item.valor)}/t`;
    default:
      return `$ ${pesoFormatter.format(item.valor)}`;
  }
};

const formatVariation = (variacion) => {
  const absolute = percentFormatter.format(Math.abs(variacion));
  if (variacion > 0) return `+${absolute}%`;
  if (variacion < 0) return `-${absolute}%`;
  return `${absolute}%`;
};

const getVariationClasses = (variacion) => {
  if (variacion > 0) {
    return {
      surface: 'bg-emerald-50/90 border-emerald-100 text-emerald-950',
      chip: 'bg-emerald-100/90 border-emerald-200 text-emerald-700',
    };
  }
  if (variacion < 0) {
    return {
      surface: 'bg-rose-50/90 border-rose-100 text-rose-950',
      chip: 'bg-rose-100/90 border-rose-200 text-rose-700',
    };
  }
  return {
    surface: 'bg-slate-50 border-slate-100 text-slate-900',
    chip: 'bg-slate-100 border-slate-200 text-slate-600',
  };
};

export default function EconomiaSection({ isExpanded, onToggle, onCollapse }) {
  const destacados = mockEconomia.slice(0, 12);

  return (
    <section className="w-full max-w-5xl mx-auto bg-white/95 rounded-2xl px-6 py-5 border border-green-100 shadow-lg shadow-emerald-500/10 transition-shadow animate-section-entry">
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={onToggle}
          className="flex items-center justify-between gap-4 w-full text-left focus:outline-none hover:opacity-90 transition-opacity"
        >
          <div className="flex items-center gap-3">
            <span className="section-icon text-slate-900 w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shadow-inner shadow-white/60">
              <EconomiaIcon className="w-6 h-6" />
            </span>
            <AnimatedText
              as="h2"
              text="Un poco de economía"
              isActive
              className="text-2xl font-bold text-emerald-700"
              speed={14}
            />
          </div>

          <span className="text-xs uppercase tracking-wide text-emerald-700/70 font-semibold">
            Panel interactivo
          </span>
        </button>

        {isExpanded && (
          <div className="mt-2 mb-2 text-slate-800">
            <AnimatedText
              as="p"
              text="Principales ítems económicos de Chile"
              isActive={isExpanded}
              className="text-sm font-medium text-slate-600 mb-6 text-center"
              speed={12}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {destacados.map((item, index) => {
                const { surface, chip } = getVariationClasses(item.variacion);

                return (
                  <div
                    key={item.id}
                    className={`${surface} rounded-2xl border px-4 py-3 flex flex-col gap-2 shadow-sm ${isExpanded ? 'animate-card' : ''}`}
                    style={isExpanded ? { animationDelay: `${index * 50}ms` } : undefined}
                  >
                    <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-600">
                      <AnimatedText
                        as="p"
                        text={item.nombre}
                        isActive={isExpanded}
                        className="text-slate-700"
                        speed={10}
                        delay={index * 15}
                      />
                      <span className="px-2 py-0.5 rounded-full border border-white/60 bg-white/70 text-[10px] text-slate-500">
                        {item.codigo}
                      </span>
                    </div>

                    <AnimatedText
                      as="p"
                      text={formatValue(item)}
                      isActive={isExpanded}
                      className="text-xl font-bold text-slate-900"
                      speed={11}
                      delay={index * 20}
                    />

                    <div className="flex items-center justify-between text-[11px] font-semibold">
                      <span className="text-slate-500">Variación</span>
                      <AnimatedText
                        as="span"
                        text={formatVariation(item.variacion)}
                        isActive={isExpanded}
                        className={`px-2 py-0.5 rounded-full border ${chip}`}
                        speed={11}
                        delay={index * 25}
                      />
                    </div>

                    <p className="text-[10px] text-right text-slate-500">Actualizado: {item.fecha}</p>
                  </div>
                );
              })}
            </div>

            <button
              className="mx-auto block bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-8 rounded-full text-sm transition-colors"
              onClick={onCollapse}
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
      </div>
    </section>
  );
}
