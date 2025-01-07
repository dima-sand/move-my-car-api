import { randomUUID } from 'crypto';
import jwt from 'jsonwebtoken';
import {
  ExpireTime,
  ITokenData,
  ITokenPair,
  TokenTypes,
} from '../../models/token/index.js';

export default class TokenService {
  private static secretAccessKey = process.env.JWT_ACCESS_KEY;
  private static secretRefreshKey = process.env.JWT_REFRESH_KEY;

  static generateTokenPair = ({
    userId,
  }: Omit<ITokenData, 'sessionId'>): ITokenPair => {
    if (!this.secretAccessKey || !this.secretRefreshKey) {
      throw Error('Secret key is undefined');
    } else {
      const randomSessionId = randomUUID();
      const data: ITokenData = {
        userId,
        sessionId: randomSessionId,
      };
      return {
        accessToken: jwt.sign(data, this.secretAccessKey, {
          expiresIn: ExpireTime.Week,
        }),
        refreshToken: jwt.sign(data, this.secretRefreshKey, {
          expiresIn: ExpireTime.Month,
        }),
      };
    }
  };

  static decodeToken = (token: string) => {
    if (!this.secretAccessKey || !this.secretRefreshKey) {
      throw Error('Secret key is undefined');
    } else {
      return jwt.decode(token, {
        json: true
      });
    }
  };

  static verifyToken = (token: string, tokenType: TokenTypes) => {
    if (!this.secretAccessKey || !this.secretRefreshKey) {
      throw Error('Secret key is undefined');
    } else {
      try {
        return jwt.verify(
          token,
          tokenType === TokenTypes.Access
            ? this.secretAccessKey
            : this.secretRefreshKey
        );
      } catch (error) {
        if(error instanceof jwt.TokenExpiredError){
          return null;
        } else{
          console.log({error});
          return null;
        }
      }
    }
  };
}
