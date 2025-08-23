export interface Project {
  id: string
  name: string
  description: string
  image: string
  technologies: string[]
  platforms: string[]
  github_link: string
  app_link: string
  appstore_link: string
  playstore_link: string
  medium_link: string
  website_reference_link: string
  slideshow_link: string
  docs_link: string
  i18nKey?: string
}
