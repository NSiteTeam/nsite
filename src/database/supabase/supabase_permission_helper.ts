import { Permission } from '../interface/permissions'

export class SupabasePermissionHelper {
  static permissionFromId(id: number): Permission | null {
    id = parseInt(id)
    switch (id) {
      case 0:
        return null
      case 1:
        return Permission.TEACHER
      case 2:
        return Permission.HISTORY_ADMIN
      case 3:
        return Permission.NEWS_ADMIN
      case 4:
        return Permission.GLOBAL_ADMIN
      default:
        throw 'Unknown permission key ' + id
    }
  }

  static idFromPermission(permission: Permission): number {
    switch (permission) {
      case Permission.TEACHER:
        return 1
      case Permission.HISTORY_ADMIN:
        return 2
      case Permission.NEWS_ADMIN:
        return 3
      case Permission.GLOBAL_ADMIN:
        return 4
      default:
        throw 'Unknown permission' + permission
    }
  }
}
