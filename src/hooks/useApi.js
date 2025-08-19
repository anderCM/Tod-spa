import { useState, useCallback } from 'react'
import api from '../services/api'

export const useApi = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const request = useCallback(async (method, url, data = null, config = {}) => {
    setLoading(true)
    setError(null)

    try {
      let response

      switch (method.toLowerCase()) {
        case 'get':
          response = await api.get(url, config)
          break
        case 'post':
          response = await api.post(url, data, config)
          break
        case 'put':
          response = await api.put(url, data, config)
          break
        case 'patch':
          response = await api.patch(url, data, config)
          break
        case 'delete':
          response = await api.delete(url, config)
          break
        default:
          throw new Error(`Método HTTP no soportado: ${method}`)
      }

      return response.data
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Error en la petición')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const get = useCallback((url, config) => request('get', url, null, config), [request])
  const post = useCallback((url, data, config) => request('post', url, data, config), [request])
  const put = useCallback((url, data, config) => request('put', url, data, config), [request])
  const patch = useCallback((url, data, config) => request('patch', url, data, config), [request])
  const del = useCallback((url, config) => request('delete', url, null, config), [request])

  return {
    loading,
    error,
    request,
    get,
    post,
    put,
    patch,
    delete: del,
    api
  }
}

export default useApi