import { computed, reactive, type Ref } from 'vue'
import type { FeedLedgerEntry } from '../domain/feed.types'

export function useFeedLedgerFilters(entries: Ref<FeedLedgerEntry[]>) {
  const filters = reactive({ kind: 'ALL', feedCode: 'ALL', search: '' })

  const filteredEntries = computed(() => {
    const search = filters.search.trim().toLowerCase()
    return entries.value.filter((entry) => {
      const matchesKind = filters.kind === 'ALL' || entry.kind === filters.kind
      const matchesFeed = filters.feedCode === 'ALL' || entry.feedCode === filters.feedCode
      const haystack = `${entry.reference} ${entry.note} ${entry.createdBy}`.toLowerCase()
      return matchesKind && matchesFeed && (!search || haystack.includes(search))
    })
  })

  return { filters, filteredEntries }
}
