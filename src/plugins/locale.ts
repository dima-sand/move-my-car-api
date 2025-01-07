import fp from 'fastify-plugin';
import {
  enLocale,
  esLocale,
  ILocale,
  LocaleLang,
  ruLocale,
} from '../constants/locales/index.js';

export interface LocalesPluginOptions {}

export default fp<LocalesPluginOptions>(async (fastify, _opts) => {
  fastify.decorateRequest('lang');
  fastify.decorate(
    'getLocale',
    (): ILocale =>
      ({
        [LocaleLang.En]: enLocale,
        [LocaleLang.Es]: esLocale,
        [LocaleLang.Ru]: ruLocale,
      }[fastify.lang])
  );
});

declare module 'fastify' {
  interface FastifyInstance {
    lang: LocaleLang;
  }
  export interface FastifyInstance {
    getLocale(): ILocale;
  }
}
