import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'
import { logoutUser } from './authSlice'

export const fetchWallets = createAsyncThunk(
  'wallets/fetchWallets',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/wallets')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al cargar billeteras')
    }
  }
)

const initialState = {
  wallets: [],
  loading: false,
  error: null
}

const walletsSlice = createSlice({
  name: 'wallets',
  initialState,
  reducers: {
    clearWallets: (state) => {
      state.wallets = []
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWallets.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchWallets.fulfilled, (state, action) => {
        state.loading = false
        state.wallets = action.payload
        state.error = null
      })
      .addCase(fetchWallets.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.wallets = []
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.wallets = []
        state.loading = false
        state.error = null
      })
  }
})

export const { clearWallets } = walletsSlice.actions
export default walletsSlice.reducer