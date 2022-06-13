import type { User, email, username, uuid } from "../interface/user";
import type { Permission } from "../interface/permissions";
export class SupabaseUser implements User {
  email: email;
  username: username;
  uuid: uuid;
  permissions: Permission[];

  constructor(
    email: email,
    username: username,
    uuid: uuid,
    permissions: Permission[]
  ) {
    this.email = email;
    this.username = username;
    this.uuid = uuid;
    this.permissions = permissions;
  }
}
