import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import transactionsReducer from './slices/transactionsSlice'
import salesReducer from './slices/salesSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
})