import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { checklistApi } from '../../api'
import { getErrorMessage } from '../../utils/helpers'
import { useAlerts } from '../../contexts/AlertContext'
import { FiCheckSquare, FiSquare, FiList, FiCheckCircle } from 'react-icons/fi'
import GlassCard from '../../components/common/GlassCard'

export default function SecurityChecklistPage() {
  const [context, setContext] = useState('general')
  const [customContext, setCustomContext] = useState('')
  const [checklist, setChecklist] = useState(null)
  const [loading, setLoading] = useState(false)
  const { addAlert } = useAlerts()

  const handleGenerate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setChecklist(null)

    const selectedContext = context === 'custom' ? customContext : context
    try {
      const response = await checklistApi.generate({ context: selectedContext })
      setChecklist(response.data)
      addAlert({ type: 'success', message: 'Checklist successfully compiled.' })
    } catch (err) {
      addAlert({ type: 'danger', message: getErrorMessage(err) })
    } finally {
      setLoading(false)
    }
  }

  // Toggle item completion state locally
  const toggleItem = (categoryIndex, itemIndex) => {
    if (!checklist) return
    const updated = { ...checklist }
    const targetItem = updated.categories[categoryIndex].items[itemIndex]
    targetItem.completed = !targetItem.completed
    setChecklist(updated)

    // Optional user feedback toast
    if (targetItem.completed) {
      addAlert({ type: 'success', message: `Completed: ${targetItem.task.slice(0, 30)}...`, duration: 1500 })
    }
  }

  // Calculate stats
  const getStats = () => {
    if (!checklist) return { total: 0, completed: 0, percent: 0 }
    let total = 0
    let completed = 0
    checklist.categories.forEach((cat) => {
      cat.items.forEach((item) => {
        total++
        if (item.completed) completed++
      })
    })
    return {
      total,
      completed,
      percent: total > 0 ? Math.round((completed / total) * 100) : 0,
    }
  }

  const stats = getStats()

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Security Checklist Generator</h1>
        <p className="text-cyber-muted mt-1">
          Generate an interactive security checklist powered by Gemini AI customized for your workplace or task.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Controls Card */}
        <GlassCard className="p-6 border border-cyber-border/40 lg:col-span-2 flex flex-col h-fit">
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-cyber-glow mb-2">
                Operational Context
              </label>
              <select
                value={context}
                onChange={(e) => setContext(e.target.value)}
                className="input-field cursor-pointer bg-cyber-navy"
              >
                <option value="general">General Home Security</option>
                <option value="remote work">Remote Workplace Setup</option>
                <option value="developer">Software Developer Security</option>
                <option value="small business">Small Business Operations</option>
                <option value="custom">Custom Context...</option>
              </select>
            </div>

            {context === 'custom' && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-cyber-glow mb-2">
                  Describe Custom Context
                </label>
                <input
                  type="text"
                  value={customContext}
                  onChange={(e) => setCustomContext(e.target.value)}
                  placeholder="e.g. cloud server deployment, home IoT setup"
                  className="input-field"
                  required
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              ) : (
                'Generate Checklist'
              )}
            </button>
          </form>
        </GlassCard>

        {/* Results Card */}
        <div className="lg:col-span-3 space-y-6">
          {loading && (
            <GlassCard className="p-8 border border-cyber-border/40 flex flex-col items-center justify-center h-full min-h-[300px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-cyber-accent mb-4" />
              <p className="text-sm text-cyber-muted animate-pulse">Assembling customized security procedures...</p>
            </GlassCard>
          )}

          {!loading && !checklist && (
            <GlassCard className="p-8 border border-cyber-border/40 flex flex-col items-center justify-center text-center h-full min-h-[300px] text-cyber-muted">
              <FiList className="text-5xl mb-4 text-cyber-border" />
              <h3 className="font-bold text-white mb-2">No Checklist Compiled</h3>
              <p className="text-xs leading-relaxed max-w-xs">
                Select or describe your operational environment on the left to compile standard audits checklists.
              </p>
            </GlassCard>
          )}

          {!loading && checklist && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              {/* Stats Card */}
              <GlassCard className="p-6 border border-cyber-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-cyber-blue/10">
                <div>
                  <h3 className="text-base font-extrabold text-white">{checklist.title}</h3>
                  <p className="text-xs text-cyber-muted capitalize mt-0.5">
                    Context: {checklist.context}
                  </p>
                </div>
                
                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] uppercase text-cyber-muted block">Completion Rate</span>
                    <span className="text-lg font-black text-white">
                      {stats.completed} / {stats.total} Tasks ({stats.percent}%)
                    </span>
                  </div>
                  {stats.percent === 100 && (
                    <FiCheckCircle className="text-3xl text-cyber-success animate-bounce" />
                  )}
                </div>
              </GlassCard>

              {/* Checklist Categories */}
              <div className="space-y-6">
                {checklist.categories.map((cat, catIdx) => (
                  <GlassCard key={catIdx} className="p-6 border border-cyber-border/40 space-y-4">
                    <h3 className="text-sm font-extrabold text-white tracking-wide border-b border-cyber-border/30 pb-2">
                      {cat.name}
                    </h3>
                    
                    <div className="space-y-3">
                      {cat.items.map((item, itemIdx) => (
                        <div
                          key={item.id || itemIdx}
                          onClick={() => toggleItem(catIdx, itemIdx)}
                          className="flex items-start gap-3 p-3 rounded-lg border bg-cyber-navy/40 border-cyber-border/20 cursor-pointer hover:border-cyber-accent/40 transition-all duration-200"
                        >
                          <span className="mt-0.5 shrink-0 text-cyber-sky hover:text-white">
                            {item.completed ? (
                              <FiCheckSquare className="text-cyber-success text-base" />
                            ) : (
                              <FiSquare className="text-cyber-muted text-base" />
                            )}
                          </span>
                          
                          <div className="flex-1 text-xs leading-relaxed select-none">
                            <span className={item.completed ? 'line-through text-cyber-muted' : 'text-slate-200'}>
                              {item.task}
                            </span>
                            <div className="mt-1 flex items-center gap-2">
                              <span className={`text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded border
                                ${item.priority === 'critical' || item.priority === 'high' ? 'bg-cyber-danger/10 border-cyber-danger/30 text-cyber-danger' : 
                                  item.priority === 'medium' ? 'bg-cyber-warning/10 border-cyber-warning/30 text-cyber-warning' : 
                                  'bg-cyber-accent/10 border-cyber-border/30 text-cyber-glow'}`}
                              >
                                {item.priority}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
