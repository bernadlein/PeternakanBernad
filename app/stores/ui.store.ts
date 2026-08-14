import { defineStore } from 'pinia'
import type { ActivityType } from '~/domain/farm.types'

export const useUiStore = defineStore('ui', {
  state: () => ({
    mobileNavOpen: false,
    activityModalOpen: false,
    notificationsOpen: false,
    defaultActivityType: 'Inspeksi kandang' as ActivityType,
    toast: '',
  }),

  actions: {
    openActivity(type: ActivityType = 'Inspeksi kandang') {
      this.defaultActivityType = type
      this.activityModalOpen = true
    },
    closeActivity() {
      this.activityModalOpen = false
    },
    closeOverlays() {
      this.mobileNavOpen = false
      this.notificationsOpen = false
    },
    notify(message: string) {
      this.toast = message
      window.setTimeout(() => {
        if (this.toast === message) this.toast = ''
      }, 2600)
    },
  },
})
