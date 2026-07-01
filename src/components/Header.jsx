import { IconBuilding } from './icons'

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-indigo-600 to-indigo-700 border-b border-indigo-500/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 rounded-lg">
            <IconBuilding className="w-6 h-6 text-indigo-300" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">CNPJ Intelligence</h1>
            <p className="text-indigo-100 text-sm">Consulta inteligente de dados de empresas para vendedores</p>
          </div>
        </div>
      </div>
    </header>
  )
}
