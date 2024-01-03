export namespace FUNCTIONS {
  export enum EMAIL_TEMPLATE {
    OFFBOARDING_APPROVER_VIEW = 'approver-view',
    OFFBOARDING_MEETING_VIEW = 'meeting-view',
    OFFBOARDING_CLOSING_PACKAGE_VIEW = 'closing-package-view',
    OFFBOARDING_SETTING_VIEW = 'setting-view',
    CLOSED_RECORD_VIEW = 'closed-record-view',
    TICKET_VIEW = 'ticket-view',
    TICKET_SUMMARY = 'ticket-summary',
    TICKET_REPLACE = 'ticket-replace',
    ADMIN_RESET_PASSWORD_VIEW = 'reset-password-view',
    ADMIN_VERIFY_CODE_VIEW = 'verify-code-view',
    ADMIN_CREATE_COMPANY = 'company-view'
  }
  export const EMAIL_TEMPLATES = Object.values(EMAIL_TEMPLATE)
}
