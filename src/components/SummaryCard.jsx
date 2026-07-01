import {
  IconBuilding,
  IconMapPin,
  IconPhone,
  IconMail,
  IconTag,
  IconCheckCircle,
  IconXCircle,
} from './icons'
import { formatCnpj, formatCep, formatDate, formatCurrency, formatPhone } from '../utils/format'

function InfoRow({ icon, label, value }) {
  if (!value) return null
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-indigo-500 shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
        <p className="text-sm font-medium text-slate-800 break-words">{value}</p>
      </div>
    </div>
  )
}

export default function SummaryCard({ data }) {
  const est = data.estabelecimento || {}
  const cnaePrincipal = est.atividade_principal
  const cidade = est.cidade?.nome
  const uf = est.estado?.sigla
  const enderecoPartes = [
    est.tipo_logradouro,
    est.logradouro,
    est.numero,
    est.complemento,
  ].filter(Boolean).join(' ')
  const bairro = est.bairro
  const cep = est.cep ? formatCep(est.cep) : null
  const telefone = est.ddd1 || est.telefone1
    ? formatPhone(est.ddd1, est.telefone1)
    : null
  const email = est.email
  const situacao = est.situacao_cadastral
  const dataSituacao = est.data_situacao_cadastral
  const inscricoes = est.inscricoes_estaduais || []
  const capitalSocial = data.capital_social

  const situacaoAtiva = /ativ/i.test(situacao || '')

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-indigo-600">
            <IconBuilding className="w-5 h-5" />
            <span className="text-xs font-semibold uppercase tracking-wide">
              {formatCnpj(data.cnpj_raiz ? data.cnpj_raiz + (est.cnpj || '').slice(8) : est.cnpj)}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1 break-words">
            {data.razao_social || 'Razão social não informada'}
          </h1>
          {est.nome_fantasia && (
            <p className="text-sm text-slate-500 mt-0.5">{est.nome_fantasia}</p>
          )}
        </div>
        {situacao && (
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold shrink-0 ${
              situacaoAtiva
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {situacaoAtiva ? <IconCheckCircle className="w-4 h-4" /> : <IconXCircle className="w-4 h-4" />}
            {situacao}
            {dataSituacao ? ` desde ${formatDate(dataSituacao)}` : ''}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
        <InfoRow
          icon={<IconMapPin className="w-5 h-5" />}
          label="Endereço"
          value={enderecoPartes ? `${enderecoPartes}${bairro ? ' - ' + bairro : ''}` : null}
        />
        <InfoRow
          icon={<IconMapPin className="w-5 h-5" />}
          label="Cidade / UF"
          value={cidade ? `${cidade}${uf ? ' - ' + uf : ''}${cep ? ' · CEP ' + cep : ''}` : null}
        />
        <InfoRow
          icon={<IconTag className="w-5 h-5" />}
          label="CNAE Principal"
          value={cnaePrincipal ? `${cnaePrincipal.subclasse ? cnaePrincipal.subclasse + ' - ' : ''}${cnaePrincipal.descricao}` : null}
        />
        <InfoRow
          icon={<IconTag className="w-5 h-5" />}
          label="Capital Social"
          value={capitalSocial ? formatCurrency(capitalSocial) : null}
        />
        <InfoRow icon={<IconPhone className="w-5 h-5" />} label="Telefone" value={telefone} />
        <InfoRow icon={<IconMail className="w-5 h-5" />} label="E-mail" value={email} />
      </div>

      {inscricoes.length > 0 && (
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400 mb-2">Inscrições Estaduais</p>
          <div className="flex flex-wrap gap-2">
            {inscricoes.map((ie, idx) => (
              <span
                key={idx}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                  ie.ativo
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-slate-50 text-slate-500 border-slate-200'
                }`}
              >
                {ie.inscricao_estadual} · {ie.estado?.sigla} · {ie.ativo ? 'Ativa' : 'Inativa'}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
