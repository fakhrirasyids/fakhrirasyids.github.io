const API_BASE_URL = 'https://api.rss2json.com/v1/api.json'

type RequestConfig = {
  params?: Record<string, string | number | boolean | null | undefined>
  signal?: AbortSignal
  headers?: HeadersInit
}

export const apiService = {
  async get<T>(url: string, config: RequestConfig = {}): Promise<{ data: T }> {
    const requestUrl = new URL(url, API_BASE_URL)

    Object.entries(config.params ?? {}).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        requestUrl.searchParams.set(key, String(value))
      }
    })

    const response = await fetch(requestUrl, {
      headers: config.headers,
      signal: config.signal,
    })

    if (!response.ok) {
      throw new Error(`Request failed with ${response.status}`)
    }

    return { data: await response.json() as T }
  },
}
