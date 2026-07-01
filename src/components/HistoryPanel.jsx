import { IconList, IconCheckCircle, IconXCircle } from './icons'

export default function HistoryPanel({ history, onSelect }) {
  if (history.length === 0) {
    return (
      <div className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 p-12 text-center">
        <IconList className="w-12 h-12 text-slate-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-slate-200 mb-2">Sem histórico</h3>
        <p className="text-slate-400">Quando você consultar CNPJs, eles aparecerão aqui.</p>
      </div>
    )
  }

  return (
    <div className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-700">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <IconList className="w-5 h-5 text-indigo-400" />
          Histórico Completo ({history.length})
        </h3>
      </div>

      <div className="divide-y divide-slate-700 max-h-96 overflow-y-auto">
        {history.map((item) => {
          const consulted = new Date(item.consultedAt)
          const dateStr = consulted.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.cnpj)}
              className="w-full px-6 py-4 hover:bg-slate-700/50 transition-colors text-left flex items-start justify-between gap-4 group"
            >
              <div className="min-w-0 flex-1">
                <p className="font-mono text-indigo-400 text-sm font-semibold group-hover:text-indigo-300 transition-colors">
                  {item.cnpj}
                </p>
                <p className="text-slate-300 text-sm mt-1 line-clamp-2">{item.razaoSocial}</p>
                <p className="text-slate-500 text-xs mt-2">{dateStr}</p>
              </div>
              <div className="mt-1 text-indigo-400 group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
