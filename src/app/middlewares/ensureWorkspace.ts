import Workspace from '@entities/Workspace';
import {
  InternalServerError,
  Unauthorized,
} from '@utils/http/errors/controlled-errors';
import { HttpError } from '@utils/http/errors/http-errors';
import { NextFunction, Request, Response } from 'express';

import jwt from 'jsonwebtoken';
export async function ensureWorkspace(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | any> {
  try {
    const workspace_token = req.headers['x-workspace-token'] as string;

    if (!workspace_token) throw new Unauthorized('No Workspace Token Provided');

    const token = workspace_token;

    jwt.verify(token, `${process.env.SECRET}`, async (err, decoded: any) => {
      if (err) throw new Unauthorized('Token invalid');

      if (!decoded.workspace_id) throw new Unauthorized('Token invalid');

      const workspace = await Workspace.findOneOrFail(decoded.workspace_id);

      if (!workspace) throw new Unauthorized('Workspace Not Found');

      req.workspaceId = decoded.workspace_id;

      if (next) return next();
    });

  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new InternalServerError();
  }
}
