import { Copy, Download, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ReviewHeaderProps {
  totalCount: number
  approvedCount: number
  rejectedCount: number
  pendingCount: number
  onExportCSV: () => void
  onCopyApproved: () => void
  onNewGeneration: () => void
}

export function ReviewHeader({
  totalCount,
  approvedCount,
  rejectedCount,
  pendingCount,
  onExportCSV,
  onCopyApproved,
  onNewGeneration,
}: ReviewHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold">{totalCount} Variações Geradas</h2>
        <p className="text-muted-foreground">
          {approvedCount} aprovadas · {rejectedCount} reprovadas · {pendingCount} pendentes
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={onCopyApproved} disabled={approvedCount === 0}>
          <Copy className="mr-2 h-4 w-4" />
          Copiar ({approvedCount})
        </Button>
        <Button variant="gradient" onClick={onExportCSV} disabled={approvedCount === 0}>
          <Download className="mr-2 h-4 w-4" />
          Exportar CSV ({approvedCount})
        </Button>
        <Button variant="outline" onClick={onNewGeneration}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Nova Geração
        </Button>
      </div>
    </div>
  )
}
