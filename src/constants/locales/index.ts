import { enLocale } from "./en.js";
import { esLocale } from "./es.js";
import { ruLocale } from "./ru.js";

export interface ILocale {
  auth: {
    loginService: {
      userNotFound: string;
      successLogin: string;
      incorrectPassword: string;
    }
  }
};

export enum LocaleLang {
  En = 'en',
  Es = 'es',
  Ru = 'ru',
}


export {
  enLocale,
  esLocale,
  ruLocale,
}