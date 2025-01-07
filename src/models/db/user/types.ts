import { LocaleLang } from "../../../constants/locales/index.js";

export enum UserRole {
  User = 'user',
  Admin = 'admin',
}

export interface IUserPreferencies {
  lang: LocaleLang;
}
