import { IconSearch, IconSpinner } from './icons'

export default function SearchBox({
  cnpjInput,
  maskCnpj,
  setCnpjInput,
  loading,
  isValidCnpjLength,
  onSubmit,
}) {
  return (
    <form onSubmit={onSubmit} className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 p-6 sm:p-8">
      <div className="mb-3">
        <label className="block text-sm font-semibold text-slate-300 mb-3">Consulte um CNPJ</label>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <IconSearch className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            inputMode="numeric"
            value={maskCnpj(cnpjInput)}
            onChange={(e) => setCnpjInput(e.target.value)}
            placeholder="00.000.000/0000-00"
            className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-700 border border-slate-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none text-slate-100 text-base placeholder-slate-400 transition-all"
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
  )
}
