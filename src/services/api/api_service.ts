import apiClient from '@/services/api/api_client'

export const apiService = {
  get: <T>(url: string, config = {}) => apiClient.get<T>(url, config),
}