import { getSiderCollapseStorage, setSiderCollapseStorage } from '@/utils/webStorage'

const useAppStore = defineStore('app', {
  state: () => ({
    siderCollapse: getSiderCollapseStorage()
  }),
  actions: {
    toggleSiderCollapse() {
      this.siderCollapse = !this.siderCollapse
      setSiderCollapseStorage(this.siderCollapse)
    }
  }
})

export default useAppStore
