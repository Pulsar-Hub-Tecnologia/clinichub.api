import { InternalServerError, Unauthorized } from '@utils/http/errors/controlled-errors';
import { HttpError } from '@utils/http/errors/http-errors';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export async function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | any> {
  try {
    const AuthHeader = req.headers.authorization;

    if (!AuthHeader) throw new Unauthorized('No Token Provided');

    const parts = AuthHeader.split(' ');

    if (parts.length !== 2) throw new Unauthorized('Token error');

    const [bearer, token] = parts;

    if (!/^Bearer$/.test(bearer)) throw new Unauthorized('Token Malformatted');

    jwt.verify(token, `${process.env.SECRET}`, (err, decoded: any) => {
      if (err) throw new Unauthorized('Token invalid');

      req.userId = decoded.id;

      if (next) return next();
    });
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new InternalServerError();
  }
}
