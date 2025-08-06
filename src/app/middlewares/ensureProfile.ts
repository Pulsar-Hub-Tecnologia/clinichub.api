import { NextFunction, Request, Response } from 'express';
import User from '@entities/User';
import { HttpError } from '@utils/http/errors/http-errors';
import {
  InternalServerError,
  Unauthorized,
} from '@utils/http/errors/controlled-errors';

export async function ensureProfile(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | any> {
  try {
    const tokenId = req.userId;

    const paramsId = req.params.id;

    const user = await User.findOneOrFail(tokenId);

    if (user.id !== paramsId) {
      throw new Unauthorized('You are not authorized');
    } else {
      if (next) return next();
    }
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new InternalServerError();
  }
}
