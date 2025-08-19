import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'
import { logoutUser } from './authSlice'

export const fetchTransactions = createAsyncThunk(
  'transactions/fetchTransactions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/transactions')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al cargar transacciones')
    }
  }
)

const initialState = {
  transactions: [],
  loading: false,
  error: null
}

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    clearTransactions: (state) => {
      state.transactions = []
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false
        state.transactions = action.payload
        state.error = null
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.transactions = []
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.transactions = []
        state.loading = false
        state.error = null
      })
  }
})

export const { clearTransactions } = transactionsSlice.actions
export default transactionsSlice.reducer