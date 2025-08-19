import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchReconciliationRules, updateReconciliationRules } from '../store/slices/reconciliationRulesSlice'
import { showToast } from '../utils/toast'

function ReconciliationRules() {
  const dispatch = useDispatch()
  const { reconciliationRules, loading, error } = useSelector((state) => state.reconciliationRules)
  const [editingRules, setEditingRules] = useState([])
  const [hasChanges, setHasChanges] = useState(false)
  
  useEffect(() => {
    dispatch(fetchReconciliationRules())
  }, [dispatch])

  useEffect(() => {
    if (reconciliationRules && reconciliationRules.length > 0) {
      setEditingRules(reconciliationRules.map(rule => ({...rule})))
    }
  }, [reconciliationRules])

  const handleFieldChange = (index, field, value) => {
    const newRules = [...editingRules]

    if (field === 'tolerance_value' || field === 'priority') {
      newRules[index][field] = parseInt(value) || 0
    } else if (field === 'active') {
      newRules[index][field] = value
    } else {
      newRules[index][field] = value
    }
    
    setEditingRules(newRules)
    setHasChanges(true)
  }

  const handleSaveAll = async () => {
    try {
      const rulesToSave = editingRules.map(rule => ({
        rule_id: rule.id,
        tolerance_value: rule.tolerance_value,
        active: rule.active,
        priority: rule.priority
      }))
      await dispatch(updateReconciliationRules(rulesToSave)).unwrap()
      setHasChanges(false)
      showToast.success('Regla actualizada correctamente')
      dispatch(fetchReconciliationRules())
    } catch (error) {
      showToast.error(error)
    }
  }

  const handleSaveIndividual = async (rule) => {
    try {
      const ruleToSave = {
        rule_id: rule.id,
        tolerance_value: rule.tolerance_value,
        active: rule.active,
        priority: rule.priority
      }
      await dispatch(updateReconciliationRules([ruleToSave])).unwrap()
      setHasChanges(false)
      showToast.success(`Regla ${rule.name || rule.id} actualizada correctamente`)
      dispatch(fetchReconciliationRules())
    } catch (error) {
      console.error('Error al guardar regla:', error)
      showToast.error(error)
    }
  }

  const handleCancel = () => {
    setEditingRules(reconciliationRules.map(rule => ({...rule})))
    setHasChanges(false)
  }

  if (loading && editingRules.length === 0) {
    return (
      <div className="text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Configuración de Reglas de Reconciliación</h3>
        {hasChanges && (
          <div>
            <button 
              className="btn btn-secondary me-2"
              onClick={handleCancel}
            >
              Cancelar
            </button>
            <button 
              className="btn btn-success"
              onClick={handleSaveAll}
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar Todos los Cambios'}
            </button>
          </div>
        )}
      </div>

      {editingRules.length === 0 ? (
        <div className="alert alert-info">
          No hay reglas de reconciliación configuradas.
        </div>
      ) : (
        <div className="row">
          {editingRules.map((rule, index) => (
            <div key={rule.id} className="col-md-6 mb-3">
              <div className="card">
                <div className="card-header">
                  <div className="d-flex justify-content-between align-items-center">
                    <h6 className="mb-0">
                      {rule?.name || 'Regla Personalizada'}
                    </h6>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={rule.active}
                        onChange={(e) => handleFieldChange(index, 'active', e.target.checked)}
                      />
                      <label className="form-check-label">
                        {rule.active ? 'Activa' : 'Inactiva'}
                      </label>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <label className="form-label">Valor de Tolerancia</label>
                    <div className="input-group">
                      <input
                        type="number"
                        className="form-control"
                        value={rule.tolerance_value}
                        onChange={(e) => handleFieldChange(index, 'tolerance_value', e.target.value)}
                        min="0"
                        max="100"
                      />
                    </div>
                    <small className="text-muted">
                      Porcentaje de tolerancia para la coincidencia
                    </small>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Prioridad</label>
                    <select 
                      className="form-select"
                      value={rule.priority}
                      onChange={(e) => handleFieldChange(index, 'priority', e.target.value)}
                      disabled // Mientras
                    >
                      <option value="1">Alta (1)</option>
                      <option value="2">Media (2)</option>
                      <option value="3">Baja (3)</option>
                      <option value="4">Muy Baja (4)</option>
                      <option value="5">Confort (5)</option>
                    </select>
                    <small className="text-muted">
                      Las reglas con menor número tienen mayor prioridad
                    </small>
                  </div>

                  <div className="d-flex justify-content-between align-items-center">
                    <span className={`badge ${rule.active ? 'bg-success' : 'bg-secondary'}`}>
                      {rule.active ? 'Activa' : 'Inactiva'}
                    </span>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleSaveIndividual(editingRules[index])}
                      disabled={loading}
                    >
                      Guardar Esta Regla
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4">
        <div className="alert alert-info">
          <h6>Información sobre las reglas:</h6>
          <ul className="mb-0">
            <li><strong>Tolerancia:</strong> Define el margen de error aceptable para considerar una coincidencia (0-100%)</li>
            <li><strong>Prioridad:</strong> Determina el orden de aplicación de las reglas (1 = más alta)</li>
            <li><strong>Estado:</strong> Las reglas inactivas no se aplicarán durante la reconciliación</li>
            <li><strong>Guardado:</strong> Puedes guardar cambios individuales o todos a la vez</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ReconciliationRules