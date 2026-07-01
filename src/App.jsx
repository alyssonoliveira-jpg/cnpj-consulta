import { useState } from 'react'
import { maskCnpj, onlyDigits, isValidCnpjLength, countFilledFields } from './utils/format'
import { IconSearch, IconSpinner, IconAlert, IconCode, IconCopy, IconCheck } from './components/icons'
import SummaryCard from './components/SummaryCard'
import DynamicJsonView from './components/DynamicJsonView'

function App() {
  const [cnpjInput, setCnpjInput] = useState('')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showRaw, setShowRaw] = useState(false)
  const [copied, setCopied] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    const digits = onlyDigits(cnpjInput)
    if (digits.length !== 14) {
      setError('Informe um CNPJ válido com 14 dígitos.')
      setData(null)
      return
    }

    setLoading(true)
    setError(null)
    setData(null)
    setShowRaw(false)

    try {
      const response = await fetch(`https://publica.cnpj.ws/cnpj/${digits}`)
      if (response.status === 404) throw new Error('CNPJ não encontrado na base pública.')
      if (response.status === 429) throw new Error('Muitas consultas. Aguarde um instante e tente novamente.')
      if (!response.ok) throw new Error(`Erro ${response.status} ao consultar.`)

      const json = await response.json()
      setData(json)
    } catch (err) {
      setError(err.message || 'Erro inesperado.')
    } finally {
      setLoading(false)
    }
  }

  function handleCopy() {
    if (!data) return
    navigator.clipboard.writeText(JSON.stringify(data, null, 2)).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  const filledCount = data ? countFilledFields(data) : 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-slate-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-indigo-700 border-b border-indigo-500/30 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <svg className="w-6 h-6 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">CNPJ Consulta</h1>
              <p className="text-indigo-100 text-sm">Dados públicos de empresas brasileiras</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Search Form */}
        <form onSubmit={handleSubmit} className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 p-6 mb-8">
          <label className="block text-sm font-semibold text-slate-300 mb-3">Consulte um CNPJ</label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <IconSearch className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                inputMode="numeric"
                value={maskCnpj(cnpjInput)}
                onChange={(e) => setCnpjInput(e.target.value)}
                placeholder="00.000.000/0000-00"
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-700 border border-slate-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none text-slate-100 placeholder-slate-400 transition-all"
                maxLength={18}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !isValidCnpjLength(cnpjInput)}
              className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed text-white font-semibold transition-all shrink-0 shadow-lg"
            >
              {loading ? <IconSpinner className="w-5 h-5" /> : <IconSearch className="w-5 h-5" />}
              {loading ? 'Consultando...' : 'Consultar'}
            </button>
          </div>
        </form>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-3 bg-red-900/30 border border-red-700/50 text-red-200 rounded-xl px-4 py-3 mb-8">
            <IconAlert className="w-5 h-5 mt-0.5 shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-slate-400">
            <IconSpinner className="w-8 h-8" />
            <p className="text-sm">Buscando informações do CNPJ...</p>
          </div>
        )}

        {/* Results */}
        {data && !loading && (
          <div className="space-y-8">
            {/* Summary Card */}
            <SummaryCard data={data} />

            {/* Stats Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-800 rounded-2xl shadow-lg border border-slate-700 px-6 py-4">
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <span className="inline-flex items-center justify-center min-w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-300 font-mono font-bold text-xs">
                  {filledCount}
                </span>
                campos preenchidos
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-slate-600 hover:border-slate-500 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  {copied ? <IconCheck className="w-4 h-4 text-emerald-400" /> : <IconCopy className="w-4 h-4" />}
                  {copied ? 'Copiado!' : 'Copiar JSON'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowRaw((v) => !v)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-slate-600 hover:border-slate-500 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  <IconCode className="w-4 h-4" />
                  {showRaw ? 'Ocultar' : 'Ver'} JSON
                </button>
              </div>
            </div>

            {/* Raw JSON */}
            {showRaw && (
              <pre className="bg-slate-900 text-emerald-300 text-xs rounded-2xl p-6 overflow-x-auto shadow-lg border border-slate-700 whitespace-pre-wrap break-words max-h-96 overflow-y-auto">
                {JSON.stringify(data, null, 2)}
              </pre>
            )}

            {/* Dynamic Data View */}
            <div className="bg-slate-800 rounded-2xl shadow-lg border border-slate-700 p-6">
              <h2 className="text-xl font-bold text-white mb-6">Todos os dados retornados</h2>
              <DynamicJsonView data={data} />
            </div>
          </div>
        )}

        {!data && !loading && !error && (
          <div className="text-center text-slate-400 text-sm py-20">
            Digite um CNPJ acima para consultar dados públicos da Receita Federal.
          </div>
        )}
      </div>
    </div>
  )
}

export default App
