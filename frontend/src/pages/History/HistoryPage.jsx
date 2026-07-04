import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { historyApi } from '../../api'
import { getErrorMessage, formatDate, truncate } from '../../utils/helpers'
import { useAlerts } from '../../contexts/AlertContext'
import { FiClock, FiFilter, FiChevronLeft, FiChevronRight, FiCheckCircle, FiInfo } from 'react-icons/fi'
import GlassCard from '../../components/common/GlassCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'

export default function HistoryPage() {
  const [history, setHistory] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [scanType, setScanType] = useState('')
  const [loading, setLoading] = useState(true)
  const { addAlert } = useAlerts()

  const PAGE_SIZE = 10

  async function loadHistory() {
    setLoading(true)
    try {
      const response = await historyApi.getAll({
        page,
        page_size: PAGE_SIZE,
        scan_type: scanType || undefined,
      })
      setHistory(response.data.records)
      setTotal(response.data.total)
    } catch (err) {
      addAlert({ type: 'danger', message: getErrorMessage(err) })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadHistory()
  }, [page, scanType])

  const handleFilterChange = (e) => {
    setScanType(e.target.value)
    setPage(1) // reset page
  }

  const getScanBadgeClass = (type) => {
    switch (type) {
      case 'phishing':
        return 'bg-blue-500/10 border-blue-500/30 text-blue-400'
      case 'password':
        return 'bg-pink-500/10 border-pink-500/30 text-pink-400'
      case 'url_scanner':
        return 'bg-purple-500/10 border-purple-500/30 text-purple-400'
      default:
        return 'bg-cyber-navy/50 border-cyber-border/40 text-cyber-glow'
    }
  }

  const getRiskBadgeClass = (risk) => {
    switch (risk?.toLowerCase()) {
      case 'critical':
      case 'high':
        return 'badge-danger'
      case 'medium':
        return 'badge-warning'
      case 'safe':
      case 'low':
        return 'badge-success'
      default:
        return 'badge-info'
    }
  }

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Operation Logs</h1>
          <p className="text-cyber-muted mt-1">
            Review past scans, safety results, and metrics captured across your audit sessions.
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2 bg-cyber-navy/40 border border-cyber-border/40 px-3 py-1.5 rounded-xl text-xs text-cyber-glow shrink-0">
          <FiFilter />
          <select
            value={scanType}
            onChange={handleFilterChange}
            className="bg-transparent border-none outline-none font-semibold cursor-pointer text-white"
          >
            <option value="" className="bg-cyber-black">All Scan Types</option>
            <option value="phishing" className="bg-cyber-black">Phishing Emails</option>
            <option value="password" className="bg-cyber-black">Password Strength</option>
            <option value="url_scanner" className="bg-cyber-black">Suspicious URLs</option>
          </select>
        </div>
      </div>

      {/* Main content list */}
      <div className="space-y-4">
        {loading ? (
          <LoadingSpinner size="lg" label="Retrieving historical logs..." />
        ) : history.length === 0 ? (
          <GlassCard className="p-8 text-center text-cyber-muted">
            <FiClock className="text-5xl mx-auto mb-4 text-cyber-border" />
            <h3 className="text-lg font-bold text-white mb-2">Logs Empty</h3>
            <p className="text-sm">Run scan operations to populate this database feed.</p>
          </GlassCard>
        ) : (
          <div className="space-y-4">
            <div className="space-y-3">
              {history.map((record) => (
                <GlassCard
                  key={record.id}
                  className="p-4 border border-cyber-border/30 hover:border-cyber-accent/30 transition-all duration-200"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${getScanBadgeClass(record.scan_type)}`}>
                        {record.scan_type === 'url_scanner' ? 'URL Scan' : record.scan_type}
                      </span>
                      <span className="text-xs text-white font-mono truncate max-w-sm">
                        {record.scan_type === 'password' ? '••••••••' : truncate(record.input_data, 50)}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono shrink-0">
                      <span className={`capitalize ${getRiskBadgeClass(record.risk_level)}`}>
                        {record.risk_level}
                      </span>
                      <span className="text-cyber-muted text-[11px]">
                        {formatDate(record.created_at)}
                      </span>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center bg-cyber-navy/40 border border-cyber-border/40 p-4 rounded-xl">
                <span className="text-xs text-cyber-muted">
                  Showing page {page} of {totalPages} ({total} entries)
                </span>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={page === 1}
                    className="p-1.5 rounded bg-cyber-navy/60 border border-cyber-border/40 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <FiChevronLeft />
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    disabled={page === totalPages}
                    className="p-1.5 rounded bg-cyber-navy/60 border border-cyber-border/40 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <FiChevronRight />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
