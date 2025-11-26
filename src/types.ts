export type MediaType = 'photo' | 'video'

export interface MediaItem {
  id: string
  type: MediaType
  filename: string
  caption: string
  roast_line: string
  audio_filename?: string | null
  audio_start_sec?: number
  audio_end_sec?: number
  video_start_sec?: number
  sticker?: string | null
  show_subtitle: boolean
}

export interface ManifestData {
  items: MediaItem[]
}


