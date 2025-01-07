export interface IGenerateTokenPayload {
  secretKey: string;
  data: ITokenData;
}

export interface ITokenData {
  userId: string;
  sessionId: string;
}

export enum ExpireTime {
  Minute = '1m',
  Day = '1d',
  Week = '7d',
  Month = '30d',
}

export interface ITokenPair {
  accessToken: string;
  refreshToken: string;
}

export enum TokenTypes {
  Access = 'access_token',
  Refresh = 'refresh_token',
  Decoded = 'decodedTonen',
}
