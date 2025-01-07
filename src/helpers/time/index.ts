import { ExpireTime } from '../../models/token/index.js';

export const getMilliseconds = (expireTime: ExpireTime) =>
  ({
    [ExpireTime.Minute]: 60 * 1000,
    [ExpireTime.Day]: 24 * 60 * 60 * 1000,
    [ExpireTime.Week]: 7 * 24 * 60 * 60 * 1000,
    [ExpireTime.Month]: 30 * 24 * 60 * 60 * 1000,
  }[expireTime]);

export const getSeconds = (expireTime: ExpireTime) =>
  getMilliseconds(expireTime) / 1000;
