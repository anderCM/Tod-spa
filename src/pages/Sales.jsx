import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchSales } from '../store/slices/salesSlice'

function Sales() {
  const { sales, loading, error } = useSelector((state) => state.sales)
  const { isAuthenticated } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  useEffect(() => {
    if (isAuthenticated && sales.length === 0) {
      dispatch(fetchSales())
    }
  }, [isAuthenticated, dispatch, sales.length])

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(parseFloat(amount))
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status) => {
    const statusClasses = {
      completed: 'bg-success',
      pending: 'bg-warning',
      cancelled: 'bg-danger',
      processing: 'bg-info'
    }
    const statusLabels = {
      completed: 'Completada',
      pending: 'Pendiente',
      cancelled: 'Cancelada',
      processing: 'Procesando'
    }
    return (
      <span className={`badge ${statusClasses[status] || 'bg-secondary'}`}>
        {statusLabels[status] || status}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando ventas...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        Error al cargar las ventas: {error}
      </div>
    )
  }

  return (
    <div>
      <h2 className="mb-4">Ventas</h2>
      
      {sales.length === 0 ? (
        <div className="alert alert-info" role="alert">
          No hay ventas disponibles.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Número de Venta</th>
                <th>Fecha</th>
                <th>Descripción</th>
                <th>Monto Total</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => (
                <tr key={sale.id}>
                  <td>
                    <code>{sale.sale_number}</code>
                  </td>
                  <td>{formatDate(sale.sale_date)}</td>
                  <td>{sale.description}</td>
                  <td className="text-end fw-bold">
                    {formatAmount(sale.total_amount)}
                  </td>
                  <td>{getStatusBadge(sale.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Sales