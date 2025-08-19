import { useEffect } from 'react'
import { Outlet, useLocation, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logoutUser } from '../store/slices/authSlice'
import { fetchWallets } from '../store/slices/walletSlice'
import StoreInfo from './StoreInfo'

function Layout() {
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const location = useLocation()

  useEffect(() => {
    if (!isAuthenticated) {
      return
    }
    dispatch(fetchWallets())
  }, [])

  const handleLogout = () => {
    dispatch(logoutUser())
  }

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return 'Dashboard'
      case '/reconciliation-rules':
        return 'Reglas de Reconciliación'
      case '/transactions':
        return 'Transacciones'
      case '/sales':
        return 'Ventas'
      case '/reconciliations':
        return 'Reconciliaciones'
      default:
        return 'Panel de Control'
    }
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1>{getPageTitle()}</h1>
              {user && <p className="text-muted mb-0">Bienvenido, {user.name}</p>}
            </div>
            <button 
              className="btn btn-outline-danger"
              onClick={handleLogout}
            >
              Cerrar Sesión
            </button>
          </div>
          <StoreInfo />
          <nav className="mb-4">
            <ul className="nav nav-tabs">
              <li className="nav-item">
                <Link 
                  className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
                  to="/dashboard"
                >
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className={`nav-link ${location.pathname === '/reconciliation-rules' ? 'active' : ''}`}
                  to="/reconciliation-rules"
                >
                  Reglas de Reconciliación
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className={`nav-link ${location.pathname === '/transactions' ? 'active' : ''}`}
                  to="/transactions"
                >
                  Transacciones
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className={`nav-link ${location.pathname === '/sales' ? 'active' : ''}`}
                  to="/sales"
                >
                  Ventas
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className={`nav-link ${location.pathname === '/reconciliations' ? 'active' : ''}`}
                  to="/reconciliations"
                >
                  Reconciliaciones
                </Link>
              </li>
            </ul>
          </nav>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Layout