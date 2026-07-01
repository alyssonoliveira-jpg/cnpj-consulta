export function onlyDigits(value) {
  return String(value ?? '').replace(/\D/g, '')
}

export function maskCnpj(value) {
  const digits = onlyDigits(value).slice(0, 14)
  let out = digits
  if (digits.length > 12) {
    out = digits.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/, '$1.$2.$3/$4-$5')
  } else if (digits.length > 8) {
    out = digits.replace(/^(\d{2})(\d{3})(\d{3})(\d{0,4})/, '$1.$2.$3/$4')
  } else if (digits.length > 5) {
    out = digits.replace(/^(\d{2})(\d{3})(\d{0,3})/, '$1.$2.$3')
  } else if (digits.length > 2) {
    out = digits.replace(/^(\d{2})(\d{0,3})/, '$1.$2')
  }
  return out
}

export function formatCnpj(value) {
  const digits = onlyDigits(value)
  if (digits.length !== 14) return value
  return digits.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')
}

export function formatCep(value) {
  const digits = onlyDigits(value)
  if (digits.length !== 8) return value
  return digits.replace(/^(\d{5})(\d{3})$/, '$1-$2')
}

export function formatPhone(ddd, numero) {
  const d = onlyDigits(ddd)
  const n = onlyDigits(numero)
  if (!n) return ''
  if (n.length === 9) return `(${d}) ${n.slice(0, 5)}-${n.slice(5)}`
  if (n.length === 8) return `(${d}) ${n.slice(0, 4)}-${n.slice(4)}`
  return d ? `(${d}) ${n}` : n
}

export function isIsoDate(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}(T.*)?$/.test(value)
}

export function formatDate(value) {
  if (!isIsoDate(value)) return value
  const datePart = value.slice(0, 10)
  const [y, m, d] = datePart.split('-')
  return `${d}/${m}/${y}`
}

export function isCurrencyKey(key) {
  return /capital_social|valor|salario|receita/i.test(key || '')
}

export function formatCurrency(value) {
  const num = typeof value === 'number' ? value : parseFloat(value)
  if (Number.isNaN(num)) return String(value)
  return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function isValidCnpjLength(value) {
  return onlyDigits(value).length === 14
}

export function humanizeKey(key) {
  return String(key)
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

export function formatBoolean(value) {
  return value ? 'Sim' : 'Não'
}

export function countFilledFields(data) {
  if (data === null || data === undefined) return 0
  if (Array.isArray(data)) {
    return data.reduce((acc, item) => acc + countFilledFields(item), 0)
  }
  if (typeof data === 'object') {
    return Object.values(data).reduce((acc, v) => acc + countFilledFields(v), 0)
  }
  return data === '' ? 0 : 1
}

export function formatPrimitiveValue(key, value) {
  if (value === null || value === undefined || value === '') return '—'
  if (typeof value === 'boolean') return formatBoolean(value)
  if (typeof value === 'string' && isIsoDate(value)) return formatDate(value)
  if (isCurrencyKey(key) && (typeof value === 'number' || /^\d+(\.\d+)?$/.test(String(value)))) {
    return formatCurrency(value)
  }
  if (/^cep$/i.test(key) && typeof value === 'string' && onlyDigits(value).length === 8) {
    return formatCep(value)
  }
  if (/cnpj/i.test(key) && typeof value === 'string' && onlyDigits(value).length === 14) {
    return formatCnpj(value)
  }
  return String(value)
}
