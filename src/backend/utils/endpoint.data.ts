/**
 * Constantes des permissions et endpoints
 */
const E = {
  // Permissions des modules
  postModule: 'postModule',
  editModule: 'editModule',
  deleteModule: 'deleteModule',
  viewModule: 'viewModule',
  listModules: 'listModules',

  // Permissions des utilisateurs
  createUser: 'createUser',
  editUser: 'editUser',
  deleteUser: 'deleteUser',
  viewUser: 'viewUser',
  listUsers: 'listUsers',

  // Permissions d'administration
  adminAccess: 'adminAccess',
  systemConfig: 'systemConfig',
  viewLogs: 'viewLogs',
  manageLogs: 'manageLogs',

  // Permissions des rôles
  createRole: 'createRole',
  editRole: 'editRole',
  deleteRole: 'deleteRole',
  viewRole: 'viewRole',
  listRoles: 'listRoles',
  assignRole: 'assignRole',

  // Permissions des permissions
  createPermission: 'createPermission',
  editPermission: 'editPermission',
  deletePermission: 'deletePermission',
  viewPermission: 'viewPermission',
  listPermissions: 'listPermissions',
  assignPermission: 'assignPermission',

  // Permissions des fichiers
  uploadFile: 'uploadFile',
  downloadFile: 'downloadFile',
  deleteFile: 'deleteFile',
  viewFile: 'viewFile',
  listFiles: 'listFiles',

  // Permissions des rapports
  createReport: 'createReport',
  editReport: 'editReport',
  deleteReport: 'deleteReport',
  viewReport: 'viewReport',
  listReports: 'listReports',
  exportReport: 'exportReport',

  // Permissions des configurations
  editConfig: 'editConfig',
  viewConfig: 'viewConfig',
  resetConfig: 'resetConfig',

  // Permissions des notifications
  createNotification: 'createNotification',
  editNotification: 'editNotification',
  deleteNotification: 'deleteNotification',
  viewNotification: 'viewNotification',
  listNotifications: 'listNotifications',
  sendNotification: 'sendNotification',

  // Permissions des backups
  createBackup: 'createBackup',
  restoreBackup: 'restoreBackup',
  deleteBackup: 'deleteBackup',
  viewBackup: 'viewBackup',
  listBackups: 'listBackups',

  // Permissions des audits
  viewAudit: 'viewAudit',
  listAudits: 'listAudits',
  exportAudit: 'exportAudit',

  // Permissions des API
  apiAccess: 'apiAccess',
  apiAdmin: 'apiAdmin',
  apiRead: 'apiRead',
  apiWrite: 'apiWrite',
  apiDelete: 'apiDelete',

  // Permissions des intégrations
  manageIntegrations: 'manageIntegrations',
  viewIntegrations: 'viewIntegrations',
  testIntegrations: 'testIntegrations',
} as const;

/**
 * Groupes de permissions pour faciliter la gestion
 */
export const PermissionGroups = {
  MODULE_FULL: [E.postModule, E.editModule, E.deleteModule, E.viewModule, E.listModules],
  MODULE_READ: [E.viewModule, E.listModules],
  MODULE_WRITE: [E.postModule, E.editModule],

  USER_FULL: [E.createUser, E.editUser, E.deleteUser, E.viewUser, E.listUsers],
  USER_READ: [E.viewUser, E.listUsers],
  USER_WRITE: [E.createUser, E.editUser],

  ADMIN_FULL: [E.adminAccess, E.systemConfig, E.viewLogs, E.manageLogs],

  FILE_FULL: [E.uploadFile, E.downloadFile, E.deleteFile, E.viewFile, E.listFiles],
  FILE_READ: [E.downloadFile, E.viewFile, E.listFiles],
  FILE_WRITE: [E.uploadFile, E.deleteFile],

  REPORT_FULL: [E.createReport, E.editReport, E.deleteReport, E.viewReport, E.listReports, E.exportReport],
  REPORT_READ: [E.viewReport, E.listReports, E.exportReport],
  REPORT_WRITE: [E.createReport, E.editReport],

  API_FULL: [E.apiAccess, E.apiAdmin, E.apiRead, E.apiWrite, E.apiDelete],
  API_READ: [E.apiAccess, E.apiRead],
  API_WRITE: [E.apiAccess, E.apiRead, E.apiWrite],
};

/**
 * Rôles prédéfinis avec leurs permissions
 */
export const DefaultRoles = {
  SUPER_ADMIN: {
    name: 'Super Admin',
    permissions: Object.values(E)
  },
  ADMIN: {
    name: 'Administrator',
    permissions: [
      ...PermissionGroups.MODULE_FULL,
      ...PermissionGroups.USER_FULL,
      ...PermissionGroups.ADMIN_FULL,
      ...PermissionGroups.FILE_FULL,
      ...PermissionGroups.REPORT_FULL,
      E.editConfig,
      E.viewConfig,
    ]
  },
  MANAGER: {
    name: 'Manager',
    permissions: [
      ...PermissionGroups.MODULE_FULL,
      ...PermissionGroups.USER_READ,
      ...PermissionGroups.FILE_FULL,
      ...PermissionGroups.REPORT_FULL,
      E.viewConfig,
    ]
  },
  USER: {
    name: 'User',
    permissions: [
      ...PermissionGroups.MODULE_READ,
      E.viewUser,
      ...PermissionGroups.FILE_READ,
      ...PermissionGroups.REPORT_READ,
    ]
  },
  GUEST: {
    name: 'Guest',
    permissions: [
      E.viewModule,
      E.listModules,
      E.viewReport,
      E.listReports,
    ]
  }
};

export default E;