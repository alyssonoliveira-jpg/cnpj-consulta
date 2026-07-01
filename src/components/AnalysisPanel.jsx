import { IconChevronDown, IconCheckCircle, IconLayers } from './icons'
import { useState } from 'react'
import { formatDate, formatCurrency, formatBoolean } from '../utils/format'

function ExpandableSection({ title, items }) {
  const [open, setOpen] = useState(true)
  return (
    <div className="border border-slate-700 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-slate-700/50 hover:bg-slate-700 transition-colors"
      >
        <span className="font-semibold text-slate-200 text-sm">{title}</span>
        <IconChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="divide-y divide-slate-700">
          {items.map((item, idx) => (
            <div key={idx} className="px-4 py-3 bg-slate-800/50 flex justify-between items-start text-sm">
              <span className="text-slate-400">{item.label}</span>
              <span className="text-slate-100 font-medium text-right ml-4">{item.value}</span>
            </div>
          ))}
          {items.length === 0 && <p className="px-4 py-3 text-slate-400 text-sm">Sem dados</p>}
        </div>
      )}
    </div>
  )
}

function RecommendationCard({ data }) {
  const est = data.estabelecimento || {}
  const recommendations = []

  const isActive = /ativ/i.test(est.situacao_cadastral || '')
  if (!isActive) {
    recommendations.push({
      icon: '⚠️',
      title: 'Empresa inativa',
      desc: 'Verifique a situação antes de prosseguir com a negociação.',
      priority: 'high',
    })
  }

  if (data.capital_social && data.capital_social < 5000) {
    recommendations.push({
      icon: '📊',
      title: 'Baixo capital social',
      desc: 'Empresa com capital limitado. Considere análise de crédito mais rigorosa.',
      priority: 'medium',
    })
  }

  if (!est.email && !est.ddd1) {
    recommendations.push({
      icon: '📞',
      title: 'Sem contato',
      desc: 'Nenhum e-mail ou telefone registrado. Pode dificultar comunicação.',
      priority: 'high',
    })
  }

  if (est.email && est.ddd1) {
    recommendations.push({
      icon: '✅',
      title: 'Contatos completos',
      desc: 'E-mail e telefone disponíveis para comunicação direta.',
      priority: 'positive',
    })
  }

  const ageMs = Date.now() - new Date(data.data_abertura).getTime()
  const yearsOld = ageMs / (1000 * 60 * 60 * 24 * 365)
  if (yearsOld < 1) {
    recommendations.push({
      icon: '🆕',
      title: 'Empresa nova',
      desc: 'Menos de 1 ano de operação. Histórico limitado.',
      priority: 'medium',
    })
  } else if (yearsOld > 10) {
    recommendations.push({
      icon: '⭐',
      title: 'Empresa consolidada',
      desc: `Mais de ${Math.floor(yearsOld)} anos no mercado.`,
      priority: 'positive',
    })
  }

  return (
    <div className="space-y-2">
      {recommendations.map((rec, idx) => (
        <div
          key={idx}
          className={`rounded-lg p-3 border ${
            rec.priority === 'high'
              ? 'bg-red-500/10 border-red-500/30'
              : rec.priority === 'positive'
                ? 'bg-emerald-500/10 border-emerald-500/30'
                : 'bg-yellow-500/10 border-yellow-500/30'
          }`}
        >
          <div className="flex items-start gap-2">
            <span className="text-lg mt-0.5">{rec.icon}</span>
            <div>
              <p className="font-semibold text-sm text-slate-100">{rec.title}</p>
              <p className="text-xs text-slate-300 mt-0.5">{rec.desc}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function AnalysisPanel({ data }) {
  const est = data.estabelecimento || {}
  const simples = data.simples || {}

  const mainItems = [
    { label: 'Situação Cadastral', value: est.situacao_cadastral || '—' },
    { label: 'Desde', value: est.data_situacao_cadastral ? formatDate(est.data_situacao_cadastral) : '—' },
    { label: 'Abertura', value: data.data_abertura ? formatDate(data.data_abertura) : '—' },
    { label: 'Última Atualização', value: data.atualizado_em ? formatDate(data.atualizado_em) : '—' },
  ]

  const regimeItems = [
    { label: 'MEI', value: simples.mei ? 'Sim' : 'Não' },
    { label: 'Simples Nacional', value: simples.simples ? 'Sim' : 'Não' },
    { label: 'Data Opção MEI', value: simples.data_opcao_mei ? formatDate(simples.data_opcao_mei) : '—' },
    { label: 'Data Opção Simples', value: simples.data_opcao_simples ? formatDate(simples.data_opcao_simples) : '—' },
  ]

  const atividades =
    est.atividades_secundarias && est.atividades_secundarias.length > 0
      ? est.atividades_secundarias.map((a) => ({
          label: `${a.subclasse || ''} - ${a.descricao || ''}`,
          value: '—',
        }))
      : [{ label: 'Nenhuma atividade secundária', value: '—' }]

  const inscricoes =
    est.inscricoes_estaduais && est.inscricoes_estaduais.length > 0
      ? est.inscricoes_estaduais.map((ie) => ({
          label: `${ie.estado?.sigla || ''} - ${ie.inscricao_estadual || ''}`,
          value: ie.ativo ? 'Ativa' : 'Inativa',
        }))
      : [{ label: 'Sem inscrições estaduais', value: '—' }]

  return (
    <div className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 p-6 sm:p-8">
      <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <IconLayers className="w-6 h-6 text-indigo-400" />
        Análise Detalhada
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recomendações */}
        <div>
          <h4 className="font-semibold text-slate-200 text-sm mb-4">Recomendações para Vendedor</h4>
          <RecommendationCard data={data} />
        </div>

        {/* Informações Principais */}
        <div>
          <ExpandableSection title="Informações Principais" items={mainItems} />
        </div>

        {/* Regime Tributário */}
        <div>
          <ExpandableSection title="Regime Tributário" items={regimeItems} />
        </div>

        {/* Atividades Secundárias */}
        <div>
          <ExpandableSection title={`Atividades Secundárias (${est.atividades_secundarias?.length || 0})`} items={atividades} />
        </div>

        {/* Inscrições Estaduais */}
        <div>
          <ExpandableSection title={`Inscrições Estaduais (${est.inscricoes_estaduais?.length || 0})`} items={inscricoes} />
        </div>

        {/* Qualificações */}
        <div>
          <ExpandableSection
            title="Qualificações"
            items={[
              {
                label: 'Responsável',
                value: data.qualificacao_do_responsavel?.descricao || '—',
              },
              {
                label: 'Natureza Jurídica',
                value: data.natureza_juridica?.descricao || '—',
              },
            ]}
          />
        </div>
      </div>
    </div>
  )
}
