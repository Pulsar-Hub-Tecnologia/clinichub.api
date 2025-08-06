import { NextFunction, Request, Response } from 'express';
import User from '@entities/User';
import {
  InternalServerError,
  Unauthorized,
} from '@utils/http/errors/controlled-errors';
import Workspace from '@entities/Workspace';
import Access from '@entities/Access';
import { HttpError } from '@utils/http/errors/http-errors';

export async function ensureAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | any> {
  try {
    const userId = req.userId;

    const user = await User.findOneOrFail(userId);

    if (!user) {
      throw new Unauthorized();
    }

    const workspaceId = req.workspaceId;

    const workspace = await Workspace.findOneOrFail(workspaceId);

    if (!workspace) {
      throw new Unauthorized();
    }

    const access = await Access.findOne({ where: { user, workspace } });

    if (!access || access.role !== 'ADMIN' || 'OWNER') {
      throw new Unauthorized();
    }

    if (next) return next();
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new InternalServerError();
  }
}
