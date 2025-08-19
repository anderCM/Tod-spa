import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Login from './pages/Login'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import ReconciliationRules from './pages/ReconciliationRules'
import Transactions from './pages/Transactions'
import Sales from './pages/Sales'

function PrivateRoute({ children }) {
  const { isAuthenticated } = useSelector((state) => state.auth)
  return isAuthenticated ? children : <Navigate to="/login" />
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/login" element={<Login />} />

      <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reconciliation-rules" element={<ReconciliationRules />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/sales" element={<Sales />} />
      </Route>
    </Routes>
  )
}

export default App