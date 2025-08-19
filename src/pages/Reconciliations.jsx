import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { createReconciliation, fetchReconciliations, clearSuccess, clearError } from '../store/slices/reconciliationsSlice'

function Reconciliations() {
  const dispatch = useDispatch()
  const { creating, error, success, reconciliations, loading } = useSelector((state) => state.reconciliations)
  
  const [formData, setFormData] = useState({
    start_date: '',
    end_date: ''
  })
  const [expandedRows, setExpandedRows] = useState({})

  useEffect(() => {
    dispatch(fetchReconciliations())
  }, [dispatch])

  useEffect(() => {
    if (success) {
      dispatch(fetchReconciliations())
      const timer = setTimeout(() => {
        dispatch(clearSuccess())
      }, 3000)
      
      setFormData({
        start_date: '',
        end_date: ''
      })
      
      return () => clearTimeout(timer)
    }
  }, [success, dispatch])

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError())
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [error, dispatch])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.start_date || !formData.end_date) {
      return
    }

    if (new Date(formData.start_date) > new Date(formData.end_date)) {
      alert('La fecha de inicio no puede ser mayor que la fecha de fin')
      return
    }

    dispatch(createReconciliation(formData))
  }

  const getTodayDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  const toggleRowExpansion = (id) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(parseFloat(amount))
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { class: 'bg-success', label: 'Completada' },
      with_errors: { class: 'bg-danger', label: 'Con Errores' },
      pending: { class: 'bg-warning', label: 'Pendiente' },
      processing: { class: 'bg-info', label: 'Procesando' }
    }
    const config = statusConfig[status] || { class: 'bg-secondary', label: status }
    return (
      <span className={`badge ${config.class}`}>
        {config.label}
      </span>
    )
  }

  const getMatchStatusBadge = (status) => {
    const statusConfig = {
      matched: { class: 'bg-success', label: 'Conciliado' },
      unmatched: { class: 'bg-warning', label: 'No Conciliado' },
      disputed: { class: 'bg-danger', label: 'Disputado' }
    }
    const config = statusConfig[status] || { class: 'bg-secondary', label: status }
    return (
      <span className={`badge ${config.class}`}>
        {config.label}
      </span>
    )
  }

  return (
    <div>
      <h2 className="mb-4">Reconciliaciones</h2>

      <div className="card mb-4">
        <div className="card-header">
          <h5 className="mb-0">Crear Nueva Reconciliación</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-5">
                <div className="mb-3">
                  <label htmlFor="start_date" className="form-label">
                    Fecha de Inicio
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="start_date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    max={getTodayDate()}
                    required
                    disabled={creating}
                  />
                </div>
              </div>

              <div className="col-md-5">
                <div className="mb-3">
                  <label htmlFor="end_date" className="form-label">
                    Fecha de Fin
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="end_date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                    min={formData.start_date}
                    max={getTodayDate()}
                    required
                    disabled={creating}
                  />
                </div>
              </div>

              <div className="col-md-2 d-flex align-items-end">
                <button 
                  type="submit" 
                  className="btn btn-primary w-100 mb-3"
                  disabled={creating || !formData.start_date || !formData.end_date}
                >
                  {creating ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Creando...
                    </>
                  ) : (
                    'Crear Reconciliación'
                  )}
                </button>
              </div>
            </div>
          </form>

          {success && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              <strong>¡Éxito!</strong> La reconciliación se ha creado correctamente.
            </div>
          )}

          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              <strong>Error:</strong> {error}
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">Historial de Reconciliaciones</h5>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="d-flex justify-content-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando reconciliaciones...</span>
              </div>
            </div>
          ) : reconciliations.length === 0 ? (
            <div className="alert alert-info mb-0" role="alert">
              No hay reconciliaciones registradas aún. Crea una nueva reconciliación utilizando el formulario anterior.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th style={{width: '50px'}}></th>
                    <th>Período</th>
                    <th>Estado</th>
                    <th>Tipo</th>
                    <th>Conciliados</th>
                    <th>No Conciliados</th>
                    <th>Monto Conciliado</th>
                    <th>Completado</th>
                  </tr>
                </thead>
                <tbody>
                  {reconciliations.map((rec) => (
                    <>
                      <tr key={rec.id} className="align-middle">
                        <td>
                          <button 
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => toggleRowExpansion(rec.id)}
                          >
                            {expandedRows[rec.id] ? '▼' : '>'}
                          </button>
                        </td>
                        <td>
                          {rec.period?.start_date && rec.period?.end_date ? (
                            <>
                              {new Date(rec.period.start_date).toLocaleDateString('es-CL')} - 
                              {new Date(rec.period.end_date).toLocaleDateString('es-CL')}
                            </>
                          ) : '-'}
                        </td>
                        <td>{getStatusBadge(rec.status)}</td>
                        <td>
                          <span className="badge bg-secondary">
                            {rec.reconciliation_type === 'automatic' ? 'Automática' : 'Manual'}
                          </span>
                        </td>
                        <td>{rec.totals?.matched || 0}</td>
                        <td>{rec.totals?.unmatched || 0}</td>
                        <td>{rec.totals?.amount_matched ? formatAmount(rec.totals.amount_matched) : '-'}</td>
                        <td>
                          {rec.completed_at ? 
                            new Date(rec.completed_at).toLocaleString('es-CL') : 
                            '-'
                          }
                        </td>
                      </tr>
                      {expandedRows[rec.id] && (
                        <tr>
                          <td colSpan="10" className="bg-light">
                            <div className="p-3">
                              <h6 className="mb-3">Detalle de Items</h6>
                              
                              {rec.items_summary?.matched_items?.length > 0 && (
                                <div className="mb-3">
                                  <h6 className="text-success">Items Conciliados ({rec.items_summary.matched_items.length})</h6>
                                  <table className="table table-sm">
                                    <thead>
                                      <tr>
                                        <th>Estado</th>
                                        <th>Origen</th>
                                        <th>Referencia</th>
                                        <th>Monto</th>
                                        <th>Diferencia</th>
                                        <th>Regla Aplicada</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {rec.items_summary.matched_items.map(item => (
                                        <tr key={item.id}>
                                          <td>{getMatchStatusBadge(item.match_status)}</td>
                                          <td>{item.source_info?.type}</td>
                                          <td><code>{item.source_info?.reference}</code></td>
                                          <td>{item.source_info?.amount ? formatAmount(item.source_info.amount) : '-'}</td>
                                          <td>{item.amount_difference ? formatAmount(item.amount_difference) : '-'}</td>
                                          <td>{item.match_rule_applied || '-'}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}

                              {rec.items_summary?.unmatched_items?.length > 0 && (
                                <div className="mb-3">
                                  <h6 className="text-warning">Items No Conciliados ({rec.items_summary.unmatched_items.length})</h6>
                                  <table className="table table-sm">
                                    <thead>
                                      <tr>
                                        <th>Estado</th>
                                        <th>Origen</th>
                                        <th>Referencia</th>
                                        <th>Monto</th>
                                        <th>Cliente</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {rec.items_summary.unmatched_items.map(item => (
                                        <tr key={item.id}>
                                          <td>{getMatchStatusBadge(item.match_status)}</td>
                                          <td>{item.source_info?.type}</td>
                                          <td><code>{item.source_info?.reference || '-'}</code></td>
                                          <td>{item.source_info?.amount ? formatAmount(item.source_info.amount) : '-'}</td>
                                          <td>{item.source_info?.customer || '-'}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}

                              {rec.items_summary?.disputed_items?.length > 0 && (
                                <div className="mb-3">
                                  <h6 className="text-danger">Items Disputados ({rec.items_summary.disputed_items.length})</h6>
                                  <table className="table table-sm">
                                    <thead>
                                      <tr>
                                        <th>Estado</th>
                                        <th>Origen</th>
                                        <th>Diferencia de Monto</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {rec.items_summary.disputed_items.map(item => (
                                        <tr key={item.id}>
                                          <td>{getMatchStatusBadge(item.match_status)}</td>
                                          <td>{item.source_info?.type}</td>
                                          <td>{item.amount_difference ? formatAmount(item.amount_difference) : '-'}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}

                              {!rec.items_summary || 
                               ((!rec.items_summary.matched_items || rec.items_summary.matched_items.length === 0) &&
                                (!rec.items_summary.unmatched_items || rec.items_summary.unmatched_items.length === 0) &&
                                (!rec.items_summary.disputed_items || rec.items_summary.disputed_items.length === 0)) && (
                                <div className="alert alert-info mb-0">
                                  No hay items detallados para esta reconciliación.
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Reconciliations