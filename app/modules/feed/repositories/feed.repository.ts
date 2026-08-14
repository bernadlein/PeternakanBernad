import type { FeedState } from '../domain/feed.types'

export interface FeedRepository {
  load(): FeedState | null
  save(state: FeedState): void
  clear(): void
}
