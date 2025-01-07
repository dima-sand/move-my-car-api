import bcrypt from 'bcrypt';

const SALT_ROUNDS = process.env.SALT_ROUNDS
  ? Number(process.env.SALT_ROUNDS)
  : 10;

export const encryptString = (password: string) =>
  bcrypt.hash(password, SALT_ROUNDS);

export const comparePasswordWithHash = (password: string, hash: string) =>
  bcrypt.compare(password, hash);
