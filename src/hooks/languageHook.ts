import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { LocaleLang } from '../constants/locales/index.js';
import SuperError from '../models/errors/SuperError.js';

const localizationHook =
  (fastify: FastifyInstance) =>
  async (req: FastifyRequest, reply: FastifyReply) => {
    if (!req.url.includes('/healthCheck') && !req.url.includes('/ws')) {
      const notSupportedLang = () => {
        reply.status(501).send({
          error: new SuperError("The language isn't supported."),
        });
      };
      try {
        const lang =
          (req.cookies['NEXT_LOCALE'] as LocaleLang) ?? LocaleLang.En;
        if (
          typeof lang === 'string' &&
          Object.values<string>(LocaleLang).includes(lang)
        ) {
          fastify.lang = lang;
        } else {
          notSupportedLang();
        }
      } catch (error) {
        notSupportedLang();
      }
    }
  };

export default localizationHook;
