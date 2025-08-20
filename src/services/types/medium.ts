// types/medium.ts
export interface MediumFeed {
  url: string
  title: string
  link: string
  author: string
  description: string
  image: string
}

export interface MediumItem {
  title: string
  pubDate: string
  link: string
  guid: string
  author: string
  thumbnail: string
  description: string
  enclosure: Record<string, unknown>
  categories: string[]
}

export interface MediumResponse {
  status: 'ok'
  feed: MediumFeed
  items: MediumItem[]
}
