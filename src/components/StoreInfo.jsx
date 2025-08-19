import { useSelector } from 'react-redux'

function StoreInfo() {
  const { user } = useSelector((state) => state.auth)
  const { wallets, loading: loadingWallets } = useSelector((state) => state.wallets)

  // Show only 1 wallet info
  const wallet = wallets && wallets.length > 0 ? wallets[0] : null

  return (
    <div className="card mb-4">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <h5 className="card-title">{user?.name || 'Tienda'}</h5>
          {wallet && (
            <div className="text-end">
              <small className="text-muted">Saldo disponible</small>
              <h4 className="text-success mb-0">
                ${wallet.balance ? wallet.balance.toLocaleString('es-CL') : '0'}
              </h4>
            </div>
          )}
          {loadingWallets && (
            <div className="spinner-border spinner-border-sm text-primary" role="status">
              <span className="visually-hidden">Cargando wallet...</span>
            </div>
          )}
        </div>
        
        <div className="row">
          <div className="col-md-6">
            <p className="mb-1"><strong>Email:</strong> {user?.email}</p>
            <p className="mb-1"><strong>Teléfono:</strong> {user?.phone}</p>
            <p className="mb-1"><strong>RUT:</strong> {user?.tax_id}</p>
          </div>
          <div className="col-md-6">
            <p className="mb-1"><strong>Dirección:</strong> {user?.address}</p>
            <p className="mb-1"><strong>Estado:</strong> 
              <span className={`badge ms-2 bg-${user?.status === 'active' ? 'success' : 'warning'}`}>
                {user?.status === 'active' ? 'Activo' : 'Inactivo'}
              </span>
            </p>
          </div>
        </div>
        
        {user?.description && (
          <div className="mt-3">
            <p className="text-muted mb-0"><em>{user.description}</em></p>
          </div>
        )}
        
        {wallets && wallets.length > 1 && (
          <div className="alert alert-info mt-3 mb-0">
            <small>Nota: Esta tienda tiene {wallets.length} wallets asociadas.</small>
          </div>
        )}
      </div>
    </div>
  )
}

export default StoreInfo