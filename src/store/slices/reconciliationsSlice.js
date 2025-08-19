import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'
import { logoutUser } from './authSlice'

export const createReconciliation = createAsyncThunk(
  'reconciliations/create',
  async (dates, { rejectWithValue }) => {
    try {
      const response = await api.post('/reconciliations', dates)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al crear reconciliación')
    }
  }
)

export const fetchReconciliations = createAsyncThunk(
  'reconciliations/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/reconciliations')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al cargar reconciliaciones')
    }
  }
)

const initialState = {
  reconciliations: [],
  loading: false,
  creating: false,
  error: null,
  success: false
}

const reconciliationsSlice = createSlice({
  name: 'reconciliations',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearSuccess: (state) => {
      state.success = false
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createReconciliation.pending, (state) => {
        state.creating = true
        state.error = null
        state.success = false
      })
      .addCase(createReconciliation.fulfilled, (state) => {
        state.creating = false
        state.success = true
        state.error = null
      })
      .addCase(createReconciliation.rejected, (state, action) => {
        state.creating = false
        state.error = action.payload
        state.success = false
      })
      .addCase(fetchReconciliations.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchReconciliations.fulfilled, (state, action) => {
        state.loading = false
        state.reconciliations = action.payload
        state.error = null
      })
      .addCase(fetchReconciliations.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.reconciliations = []
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.reconciliations = []
        state.loading = false
        state.creating = false
        state.error = null
        state.success = false
      })
  }
})

export const { clearError, clearSuccess } = reconciliationsSlice.actions
export default reconciliationsSlice.reducer