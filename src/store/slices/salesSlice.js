import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'
import { logoutUser } from './authSlice'

export const fetchSales = createAsyncThunk(
  'sales/fetchSales',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/sales')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al cargar ventas')
    }
  }
)

const initialState = {
  sales: [],
  loading: false,
  error: null
}

const salesSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {
    clearSales: (state) => {
      state.sales = []
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSales.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSales.fulfilled, (state, action) => {
        state.loading = false
        state.sales = action.payload
        state.error = null
      })
      .addCase(fetchSales.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.sales = []
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.sales = []
        state.loading = false
        state.error = null
      })
  }
})

export const { clearSales } = salesSlice.actions
export default salesSlice.reducer