import { IconCheckCircle, IconXCircle } from './icons'
import { formatDate } from '../utils/format'

export default function InscricoesTabel({ inscricoes }) {
  if (!inscricoes || inscricoes.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Inscrições Estaduais</h2>
        <p className="text-slate-500 text-sm">Nenhuma inscrição estadual registrada.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200">
        <h2 className="text-lg font-bold text-slate-900">Inscrições Estaduais ({inscricoes.length})</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                UF
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                Inscrição Estadual
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                Tipo IE
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-600">
                Situação
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                Data Atualização
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {inscricoes.map((ie, idx) => {
              const isHabilitado = ie.ativo === true
              const tipoIe = ie.tipo || 'Normal'
              const dataAt = ie.atualizado_em || ie.data_atualizacao || ''

              return (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-slate-900">{ie.estado?.sigla || '—'}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-mono text-sm text-slate-700">{ie.inscricao_estadual || '—'}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-slate-600">{tipoIe}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        isHabilitado
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {isHabilitado ? <IconCheckCircle className="w-3.5 h-3.5" /> : <IconXCircle className="w-3.5 h-3.5" />}
                      {isHabilitado ? 'Habilitado' : 'Não Habilitado'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-slate-600">
                      {dataAt ? formatDate(dataAt) : '—'}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
