import type { App } from 'vue'

import SidebarAudit from './components/audit-sidebar/SidebarAudit.vue'
import AuditChecklist from './components/audit-sidebar/AuditChecklist.vue'
import AuditItem from './components/audit-sidebar/AuditItem.vue'

export * as SeoAudit from './lib/audit/seoAudit'
export * as UxAudit from './lib/audit/uxAudit'

export { SidebarAudit, AuditChecklist, AuditItem }

export default {
  install(app: App) {
    app.component('SidebarAudit', SidebarAudit)
    app.component('AuditChecklist', AuditChecklist)
    app.component('AuditItem', AuditItem)
  }
}
