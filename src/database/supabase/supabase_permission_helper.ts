import { Permission } from '../interface/permissions'

export class SupabasePermissionHelper {
  static permissionFromId(id: number): Permission {
    switch (id) {
      case 0:
        return Permission.TEACHER
      case 1:
        return Permission.HISTORY_ADMIN
      case 2:
        return Permission.NEWS_ADMIN
      case 3:
        return Permission.LEVEL_ADMIN
      case 4:
        return Permission.GLOBAL_ADMIN
      default:
        throw 'Unknown permission key' + id
    }
  }
}
