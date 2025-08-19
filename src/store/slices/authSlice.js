import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/login', credentials)

      if (response.data.token) {
        localStorage.setItem('token', response.data.token)

        if (response.data.store) {
          localStorage.setItem('user', JSON.stringify(response.data.store))
        }
      }

      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al iniciar sesión')
    }
  }
)

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async () => {
    try {
      await api.delete('/logout')

      localStorage.removeItem('token')
      localStorage.removeItem('user')

      return null
    } catch (error) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      
      console.error('Error en logout del servidor:', error)
      return null
    }
  }
)

const getStoredUser = () => {
  try {
    const userStr = localStorage.getItem('user')
    if (!userStr || userStr === 'undefined' || userStr === 'null') {
      return null
    }
    return JSON.parse(userStr)
  } catch (error) {
    console.error('Error parsing user from localStorage:', error)
    localStorage.removeItem('user')
    return null
  }
}

const getStoredToken = () => {
  const token = localStorage.getItem('token')
  if (!token || token === 'undefined' || token === 'null') {
    return null
  }
  return token
}

const initialState = {
  user: getStoredUser(),
  token: getStoredToken(),
  isAuthenticated: !!getStoredToken(),
  loading: false,
  error: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setUser: (state, action) => {
      state.user = action.payload
      state.isAuthenticated = true
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.store
        state.token = action.payload.token
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.isAuthenticated = false
        state.user = null
        state.token = null
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
        state.token = null
        state.isAuthenticated = false
        state.error = null
      })
  }
})

export const { clearError, setUser } = authSlice.actions
export default authSlice.reducer