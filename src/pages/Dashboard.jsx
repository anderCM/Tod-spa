import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchTransactions } from '../store/slices/transactionsSlice'
import { fetchSales } from '../store/slices/salesSlice'

function Dashboard() {
  const { isAuthenticated } = useSelector((state) => state.auth)
  const { transactions, loading: loadingTransactions } = useSelector((state) => state.transactions)
  const { sales, loading: loadingSales } = useSelector((state) => state.sales)
  const dispatch = useDispatch()

  useEffect(() => {
    if (!isAuthenticated) {
      return
    }

    dispatch(fetchTransactions())
    dispatch(fetchSales())
  }, [])

  return (
    <div className="row">
      <div className="col-md-4">
        <div className="card text-center">
          <div className="card-body">
            {loadingTransactions ? (
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            ) : (
              <>
                <h3 className="text-primary">{transactions?.length || 0}</h3>
                <p className="text-muted">Transacciones</p>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card text-center">
          <div className="card-body">
            {loadingSales ? (
              <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            ) : (
              <>
                <h3 className="text-success">{sales?.length || 0}</h3>
                <p className="text-muted">Ventas</p>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card text-center">
          <div className="card-body">
            <h3 className="text-warning">
              {(transactions?.length || 0) + (sales?.length || 0)}
            </h3>
            <p className="text-muted">Total Operaciones</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard