import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId;
  username: string;
  email: string;
  password: string;
  avatarUrl?: string;
  isAdmin?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export function createUser(username: string, email: string, password: string): User {
  return {
    username,
    email,
    password,
    isAdmin: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
