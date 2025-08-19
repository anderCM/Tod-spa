import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'
import { logoutUser } from './authSlice'

export const fetchReconciliationRules = createAsyncThunk(
  'reconciliationRules/fetchReconciliationRules',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/reconciliation_rules')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al cargar reglas de reconciliación')
    }
  }
)

export const updateReconciliationRules = createAsyncThunk(
  'reconciliationRules/updateReconciliationRules',
  async (rules, { rejectWithValue }) => {
    try {
      const payload = {
        store: {
          rules: rules
        }
      }
      const response = await api.post('/reconciliation_rules', payload)
      return response.data
    } catch (error) {
      const errorMessage = error.response?.data?.errors?.message || 
                          error.response?.data?.message || 
                          'Error al actualizar reglas'
      return rejectWithValue(errorMessage)
    }
  }
)

const initialState = {
  reconciliationRules: [],
  loading: false,
  error: null
}

const reconciliationRulesSlice = createSlice({
  name: 'reconciliationRules',
  initialState,
  reducers: {
    clearReconciliationRules: (state) => {
      state.reconciliationRules = []
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReconciliationRules.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchReconciliationRules.fulfilled, (state, action) => {
        state.loading = false
        state.reconciliationRules = action.payload.rules
        state.error = null
      })
      .addCase(fetchReconciliationRules.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload.error
        state.reconciliationRules = []
      })
      .addCase(updateReconciliationRules.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateReconciliationRules.fulfilled, (state, action) => {
        state.loading = false
        state.reconciliationRules = action.payload.rules
        state.error = null
      })
      .addCase(updateReconciliationRules.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.reconciliationRules = []
        state.loading = false
        state.error = null
      })
  }
})

export const { clearReconciliationRules } = reconciliationRulesSlice.actions
export default reconciliationRulesSlice.reducer