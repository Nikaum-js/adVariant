import * as XLSX from 'xlsx'
import type { Variation } from '@/types'
import { getStrategyLabel } from '@/lib/strategyLabels'

export function exportToCSV(variations: Variation[], filename = 'variacoes-aprovadas') {
  const approvedVariations = variations.filter((v) => v.status === 'approved')

  if (approvedVariations.length === 0) {
    throw new Error('Nenhuma variação aprovada para exportar')
  }

  const data = approvedVariations.map((v) => ({
    ID: v.id,
    Headline: v.headline,
    'Caracteres Headline': v.charCount.headline,
    Descrição: v.description,
    'Caracteres Descrição': v.charCount.description,
    Estratégia: getStrategyLabel(v.strategy),
  }))

  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Variações')

  // Auto-size columns
  const maxWidths = [
    { wch: 5 }, // ID
    { wch: 40 }, // Headline
    { wch: 18 }, // Caracteres Headline
    { wch: 60 }, // Descrição
    { wch: 20 }, // Caracteres Descrição
    { wch: 20 }, // Estratégia
  ]
  worksheet['!cols'] = maxWidths

  XLSX.writeFile(workbook, `${filename}.csv`)

  return approvedVariations.length
}

export function copyApprovedToClipboard(variations: Variation[]): string {
  const approvedVariations = variations.filter((v) => v.status === 'approved')

  if (approvedVariations.length === 0) {
    throw new Error('Nenhuma variação aprovada para copiar')
  }

  const text = approvedVariations
    .map(
      (v, index) =>
        `--- Variação ${index + 1} (${getStrategyLabel(v.strategy)}) ---\nHeadline: ${v.headline}\nDescrição: ${v.description}\n`
    )
    .join('\n')

  navigator.clipboard.writeText(text)

  return text
}
