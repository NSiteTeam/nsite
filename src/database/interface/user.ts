import type { Permission } from "./permissions";

export interface User {
  email: email;
  username: username;
  uuid: uuid;
  permissions: Permission[];
}

export type username = string;
export type email = string;
export type uuid = string;
