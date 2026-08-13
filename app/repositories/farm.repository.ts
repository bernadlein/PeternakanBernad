import type { FarmState } from '~/domain/farm.types'

export interface FarmRepository {
  load(): FarmState | null
  save(state: FarmState): void
  clear(): void
}
