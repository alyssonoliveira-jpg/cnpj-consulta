import {
  IconBuilding,
  IconMapPin,
  IconPhone,
  IconMail,
  IconTag,
  IconCheckCircle,
  IconXCircle,
  IconCode,
  IconCopy,
  IconCheck,
} from './icons'
import { formatCnpj, formatCep, formatDate, formatCurrency, formatPhone } from '../utils/format'
import { useState } from 'react'

function StatusBadge({ situation, date }) {
  const isActive = /ativ/i.test(situation || '')
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${
        isActive
          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
          : 'bg-red-500/20 text-red-300 border border-red-500/30'
      }`}
    >
      {isActive ? <IconCheckCircle className="w-4 h-4" /> : <IconXCircle className="w-4 h-4" />}
      {situation}
      {date ? ` desde ${formatDate(date)}` : ''}
    </span>
  )
}

function InfoItem({ icon, label, value }) {
  if (!value) return null
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-indigo-400 shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
        <p className="text-sm font-medium text-slate-100 break-words">{value}</p>
      </div>
    </div>
  )
}

function RiskIndicator({ data }) {
  let riskScore = 0
  const est = data.estabelecimento || {}

  if (!/ativ/i.test(est.situacao_cadastral || '')) riskScore += 40
  if (!est.email && !est.ddd1) riskScore += 15
  if (!data.capital_social || data.capital_social < 1000) riskScore += 10
  if (!est.cnpj) riskScore += 10

  let level = 'baixo'
  let color = 'text-emerald-400'
  let bgColor = 'bg-emerald-500/10'

  if (riskScore >= 25 && riskScore < 50) {
    level = 'médio'
    color = 'text-yellow-400'
    bgColor = 'bg-yellow-500/10'
  } else if (riskScore >= 50) {
    level = 'alto'
    color = 'text-red-400'
    bgColor = 'bg-red-500/10'
  }

  return (
    <div className={`rounded-lg ${bgColor} border border-slate-700 p-4`}>
      <p className="text-xs uppercase tracking-wide text-slate-400 mb-2">Risco de Contato</p>
      <div className="flex items-center justify-between">
        <span className={`text-2xl font-bold ${color}`}>{level.toUpperCase()}</span>
        <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${
              level === 'baixo' ? 'w-1/3 bg-emerald-500' : level === 'médio' ? 'w-2/3 bg-yellow-500' : 'w-full bg-red-500'
            }`}
          />
        </div>
      </div>
    </div>
  )
}

export default function CompanyCard({ data }) {
  const est = data.estabelecimento || {}
  const [showRaw, setShowRaw] = useState(false)
  const [copied, setCopied] = useState(false)

  const enderecoPartes = [est.tipo_logradouro, est.logradouro, est.numero, est.complemento]
    .filter(Boolean)
    .join(' ')
  const bairro = est.bairro
  const cidade = est.cidade?.nome
  const uf = est.estado?.sigla
  const cep = est.cep ? formatCep(est.cep) : null
  const cnaePrincipal = est.atividade_principal
  const telefone = est.ddd1 ? formatPhone(est.ddd1, est.telefone1) : null

  function handleCopy() {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2)).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  return (
    <div className="space-y-6">
      {/* Main Card */}
      <div className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6 pb-6 border-b border-slate-700">
          <div className="min-w-0">
            <p className="text-indigo-400 text-xs font-semibold uppercase tracking-wide mb-2">
              {formatCnpj(data.cnpj_raiz ? data.cnpj_raiz + (est.cnpj || '').slice(8) : est.cnpj)}
            </p>
            <h2 className="text-3xl font-bold text-white break-words">{data.razao_social || '—'}</h2>
            {est.nome_fantasia && <p className="text-sm text-slate-400 mt-2">{est.nome_fantasia}</p>}
          </div>
          <StatusBadge situation={est.situacao_cadastral} date={est.data_situacao_cadastral} />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <InfoItem
            icon={<IconMapPin className="w-5 h-5" />}
            label="Endereço"
            value={
              enderecoPartes
                ? `${enderecoPartes}${bairro ? ' - ' + bairro : ''}`
                : null
            }
          />
          <InfoItem
            icon={<IconMapPin className="w-5 h-5" />}
            label="Localização"
            value={cidade ? `${cidade}${uf ? ', ' + uf : ''}${cep ? ' - ' + cep : ''}` : null}
          />
          <InfoItem
            icon={<IconTag className="w-5 h-5" />}
            label="Porte"
            value={data.porte?.descricao}
          />
          <InfoItem
            icon={<IconTag className="w-5 h-5" />}
            label="CNAE Principal"
            value={
              cnaePrincipal
                ? `${cnaePrincipal.subclasse || ''} - ${cnaePrincipal.descricao}`
                : null
            }
          />
          <InfoItem
            icon={<IconTag className="w-5 h-5" />}
            label="Capital Social"
            value={data.capital_social ? formatCurrency(data.capital_social) : null}
          />
          <InfoItem
            icon={<IconTag className="w-5 h-5" />}
            label="Natureza Jurídica"
            value={data.natureza_juridica?.descricao}
          />
          <InfoItem icon={<IconPhone className="w-5 h-5" />} label="Telefone" value={telefone} />
          <InfoItem icon={<IconMail className="w-5 h-5" />} label="E-mail" value={est.email} />
          <InfoItem
            icon={<IconTag className="w-5 h-5" />}
            label="Abertura"
            value={data.data_abertura ? formatDate(data.data_abertura) : null}
          />
        </div>
      </div>

      {/* Risk Indicator */}
      <RiskIndicator data={data} />

      {/* Raw JSON */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
        <div className="flex items-center justify-between gap-2 px-6 py-4 bg-slate-700/50">
          <button
            type="button"
            onClick={() => setShowRaw((v) => !v)}
            className="flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-slate-100 transition-colors"
          >
            <IconCode className="w-4 h-4" />
            {showRaw ? 'Ocultar' : 'Ver'} JSON bruto
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border border-slate-600 hover:border-slate-500 bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors"
          >
            {copied ? <IconCheck className="w-4 h-4 text-emerald-400" /> : <IconCopy className="w-4 h-4" />}
            {copied ? 'Copiado' : 'Copiar'}
          </button>
        </div>
        {showRaw && (
          <pre className="bg-slate-900 text-emerald-300 text-xs overflow-x-auto p-4 border-t border-slate-700 whitespace-pre-wrap break-words max-h-96 overflow-y-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  )
}
