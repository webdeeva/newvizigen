import { ObjectId } from 'mongodb';

export interface Image {
  _id?: ObjectId;
  userId: ObjectId;
  imageUrl: string;
  prompt: string;
  model: string;
  aspectRatio: string;
  guidance: number;
  numOutputs: number;
  disableSafetyChecker: boolean;
  isPublic: boolean;
  favorites: number;
  createdAt: Date;
  updatedAt: Date;
}

export function createImage(
  userId: ObjectId,
  imageUrl: string,
  prompt: string,
  model: string,
  aspectRatio: string,
  guidance: number,
  numOutputs: number,
  disableSafetyChecker: boolean,
  isPublic: boolean
): Image {
  return {
    userId,
    imageUrl,
    prompt,
    model,
    aspectRatio,
    guidance,
    numOutputs,
    disableSafetyChecker,
    isPublic,
    favorites: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
