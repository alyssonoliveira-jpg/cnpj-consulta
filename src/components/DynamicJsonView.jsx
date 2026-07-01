import { formatPrimitiveValue, humanizeKey } from '../utils/format'
import { IconChevronDown, IconList, IconLayers } from './icons'
import { useState } from 'react'

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function PrimitiveRow({ label, value }) {
  return (
    <div className="flex justify-between gap-4 py-2 px-3 odd:bg-slate-50 rounded-md text-sm">
      <span className="text-slate-500 shrink-0">{label}</span>
      <span className="text-slate-800 font-medium text-right break-words">{value}</span>
    </div>
  )
}

function ObjectBlock({ label, data, depth }) {
  const [open, setOpen] = useState(depth < 1)
  const entries = Object.entries(data)
  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 transition-colors text-left"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <IconLayers className="w-4 h-4 text-indigo-500" />
          {label}
        </span>
        <IconChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="p-2 flex flex-col gap-1">
          {entries.length === 0 && <p className="text-sm text-slate-400 px-3 py-2">Sem dados</p>}
          {entries.map(([key, value]) => (
            <FieldRenderer key={key} label={humanizeKey(key)} rawKey={key} value={value} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

function ArrayOfObjectsBlock({ label, items, depth }) {
  const [open, setOpen] = useState(depth < 1)
  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 transition-colors text-left"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <IconList className="w-4 h-4 text-emerald-500" />
          {label}
          <span className="text-xs font-normal text-slate-400">({items.length})</span>
        </span>
        <IconChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="p-2 flex flex-col gap-2">
          {items.length === 0 && <p className="text-sm text-slate-400 px-3 py-2">Lista vazia</p>}
          {items.map((item, idx) => (
            <ObjectBlock key={idx} label={`${label} #${idx + 1}`} data={item} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

function ArrayOfPrimitivesBlock({ label, items }) {
  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 text-sm font-semibold text-slate-700">
        <IconList className="w-4 h-4 text-emerald-500" />
        {label}
        <span className="text-xs font-normal text-slate-400">({items.length})</span>
      </div>
      <div className="p-3 flex flex-wrap gap-2">
        {items.length === 0 && <p className="text-sm text-slate-400">Lista vazia</p>}
        {items.map((item, idx) => (
          <span key={idx} className="px-2 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
            {formatPrimitiveValue(label, item)}
          </span>
        ))}
      </div>
    </div>
  )
}

export function FieldRenderer({ label, rawKey, value, depth = 0 }) {
  if (Array.isArray(value)) {
    if (value.length > 0 && value.every((item) => isPlainObject(item))) {
      return <ArrayOfObjectsBlock label={label} items={value} depth={depth} />
    }
    return <ArrayOfPrimitivesBlock label={label} items={value} />
  }
  if (isPlainObject(value)) {
    return <ObjectBlock label={label} data={value} depth={depth} />
  }
  return <PrimitiveRow label={label} value={formatPrimitiveValue(rawKey, value)} />
}

export default function DynamicJsonView({ data }) {
  const entries = Object.entries(data || {})
  return (
    <div className="flex flex-col gap-2">
      {entries.map(([key, value]) => (
        <FieldRenderer key={key} label={humanizeKey(key)} rawKey={key} value={value} depth={0} />
      ))}
    </div>
  )
}
