import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchTransactions } from '../store/slices/transactionsSlice'

function Transactions() {
  const { transactions, loading, error } = useSelector((state) => state.transactions)
  const { isAuthenticated } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  useEffect(() => {
    if (isAuthenticated && transactions.length === 0) {
      dispatch(fetchTransactions())
    }
  }, [isAuthenticated, dispatch, transactions.length])

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
      failed: 'bg-danger'
    }
    const statusLabels = {
      completed: 'Completada',
      pending: 'Pendiente',
      failed: 'Fallida'
    }
    return (
      <span className={`badge ${statusClasses[status] || 'bg-secondary'}`}>
        {statusLabels[status] || status}
      </span>
    )
  }

  const getTypeLabel = (type) => {
    const typeLabels = {
      deposit: 'Depósito',
      payment: 'Pago',
      withdrawal: 'Retiro'
    }
    return typeLabels[type] || type
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando transacciones...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        Error al cargar las transacciones: {error}
      </div>
    )
  }

  return (
    <div>
      <h2 className="mb-4">Transacciones</h2>
      
      {transactions.length === 0 ? (
        <div className="alert alert-info" role="alert">
          No hay transacciones disponibles.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Tipo</th>
                <th>Descripción</th>
                <th>Referencia</th>
                <th>Monto</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{formatDate(transaction.transaction_date)}</td>
                  <td>{getTypeLabel(transaction.transaction_type)}</td>
                  <td>{transaction.description}</td>
                  <td>
                    <code>{transaction.reference}</code>
                  </td>
                  <td className="text-end fw-bold">
                    {formatAmount(transaction.amount)}
                  </td>
                  <td>{getStatusBadge(transaction.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Transactions