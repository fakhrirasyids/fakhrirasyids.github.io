import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'https://api.rss2json.com/v1/api.json',
  timeout: 10000,
})

apiClient.interceptors.response.use(
  response => response,
  error => Promise.reject(error)
)

export default apiClient
