import type { ReportPeriod, ReportType } from '~/domain/farm.types'
import { createCsvReport } from '~/services/report.service'
import { useFarmStore } from '~/stores/farm.store'
import { useUiStore } from '~/stores/ui.store'

export function useReportExport() {
  const farm = useFarmStore()
  const ui = useUiStore()

  function exportReport(type: ReportType, period: ReportPeriod) {
    if (!import.meta.client) return
    const csv = createCsvReport(type, farm.snapshot(), period)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `farmflow-${type}-${period.end}.csv`
    link.click()
    URL.revokeObjectURL(url)
    ui.notify('Laporan CSV berhasil diunduh')
  }

  return { exportReport }
}
