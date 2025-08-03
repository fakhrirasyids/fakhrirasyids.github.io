import { apiService } from '@/services/api/api_service'
import type { MediumResponse } from '@/services/types/medium'

export const mediumService = {
  getUserArticles() {
    const rssUrl = `https://medium.com/feed/@fakhrirasyids`
    return apiService.get<MediumResponse>('', {
      params: {
        rss_url: rssUrl,
      },
    })
  },
}
