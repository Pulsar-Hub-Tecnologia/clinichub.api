import { Request, Response } from 'express';
import Access from '@entities/Access';
import findAccessService from '../services/app/access/find-all';
import findWorkspaceService from '../services/app/wokspace/find';
import updateWorkspaceService from '../services/app/wokspace/update';

/**
 * @swagger
 * tags:
 *   name: Acessos
 *   description: Operações relativas aos acessos
 */

class UserController {
  public async find(req: Request, res: Response): Promise<void> {
    try {
      const access = await findWorkspaceService(req.workspaceId)

      res.status(200).json(access);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: 'Erro interno ao buscar usuário, tente novamente.' });
    }
  }
  public async update(req: Request, res: Response): Promise<void> {
    try {
      const access = await updateWorkspaceService(req.workspaceId, req.body)

      res.status(200).json(access);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: 'Erro interno ao buscar usuário, tente novamente.' });
    }
  }
}

export default new UserController();
