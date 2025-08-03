import { Request, Response } from 'express';
import Access from '@entities/Access';

interface UserInterface {
  id?: string;
  name: string;
  role: string;
  email: string;
  token: string;
  password: string;
  secret?: string;
}

/**
 * @swagger
 * tags:
 *   name: Usuários
 *   description: Operações relativas aos usuários
 */

class UserController {
  public async findAccess(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;

      const access = await Access.findOne(id, { relations: ['user'] });

      if (!access) {
        res.status(404).json({ message: 'Usuário não encontrado.' });
        return;
      }

      const user = {
        id: access.id,
        name: access.user.name,
        email: access.user.email,
        role: access.role,
      }

      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: 'Erro interno ao buscar usuário, tente novamente.' });
    }
  }

}

export default new UserController();
