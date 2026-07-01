import { IconList, IconCheckCircle } from './icons'
import { formatDate } from '../utils/format'

function StatCard({ label, value, icon }) {
  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 p-4 text-center">
      <p className="text-slate-400 text-xs uppercase tracking-wide mb-2">{label}</p>
      <p className="text-3xl font-bold text-indigo-400">{value}</p>
      {icon && <p className="text-2xl mt-2">{icon}</p>}
    </div>
  )
}

export default function Dashboard({ history, onSelectCnpj }) {
  const totalConsultas = history.length
  const todayConsultas = history.filter((h) => {
    const today = new Date()
    const consulted = new Date(h.consultedAt)
    return (
      consulted.getFullYear() === today.getFullYear() &&
      consulted.getMonth() === today.getMonth() &&
      consulted.getDate() === today.getDate()
    )
  }).length

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Consultas Totais" value={totalConsultas} icon="📊" />
        <StatCard label="Consultas Hoje" value={todayConsultas} icon="📅" />
        <StatCard label="Taxa de Retenção" value={`${totalConsultas > 0 ? Math.round((history.filter((h) => /ativ/i.test(h.status || '')).length / totalConsultas) * 100) : 0}%`} icon="📈" />
      </div>

      {/* Recent Consultations */}
      <div className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700 flex items-center gap-2">
          <IconList className="w-5 h-5 text-indigo-400" />
          <h3 className="text-lg font-bold text-white">Histórico de Consultas</h3>
          <span className="text-sm text-slate-400 ml-auto">{history.length} consultas</span>
        </div>

        {history.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            <p>Nenhuma consulta realizada ainda.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-700">
            {history.map((item) => {
              const consulted = new Date(item.consultedAt)
              const now = new Date()
              const diffMs = now - consulted
              const diffMins = Math.floor(diffMs / 60000)
              const diffHours = Math.floor(diffMs / 3600000)
              const diffDays = Math.floor(diffMs / 86400000)

              let timeStr = ''
              if (diffMins < 1) timeStr = 'Agora'
              else if (diffMins < 60) timeStr = `${diffMins}m atrás`
              else if (diffHours < 24) timeStr = `${diffHours}h atrás`
              else timeStr = `${diffDays}d atrás`

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectCnpj(item.cnpj)}
                  className="w-full px-6 py-4 hover:bg-slate-700/50 transition-colors text-left flex items-center justify-between gap-4"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-indigo-400 text-sm font-semibold">{item.cnpj}</p>
                    <p className="text-slate-400 text-sm truncate mt-1">{item.razaoSocial}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-slate-300 text-xs font-medium">{timeStr}</p>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
