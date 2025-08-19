import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import transactionsReducer from './slices/transactionsSlice'
import salesReducer from './slices/salesSlice'
import walletsReducer from './slices/walletSlice'
import reconciliationRulesReducer from './slices/reconciliationRulesSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    transactions: transactionsReducer,
    sales: salesReducer,
    wallets: walletsReducer,
    reconciliationRules: reconciliationRulesReducer
  },
})