import { Request, Response } from 'express';
import createAccountService from '../services/app/account/create';
import validateAccountService from '../services/app/account/validate';
import { HttpError } from '../../utils/http/errors/http-errors';
import updateAccountService from '../services/app/account/update';
import findAccount from '../services/app/account/find';
import findAccessesService from '../services/app/account/find-accesses';
import signWorkspaceService from '../services/app/account/sign-workspace';
import resendValidateEmailService from '../services/app/account/resend-validate-email';

interface CreateAccountBody {
  workspace_type: 'PERSONAL' | 'BUSINESS';
  email: string;
  password: string;
  name: string;
  cpf: string;
  crm_number?: string;
  workspace_name?: string;
  cnpj?: string;
}

/**
 * @swagger
 * tags:
 *   name: Conta
 *   description: Operações relativas à conta do usuário
 */

class AccountController {
  public async find(req: Request, res: Response): Promise<void> {
    try {
      const user = await findAccount(req.userId);

      res.status(200).json(user);
      return;
    } catch (error) {
      console.log(error);
      if (error instanceof HttpError)
        res.status(error.status).json({ message: error.message });
      return;
    }
  }

  public async validate(req: Request, res: Response): Promise<void> {
    try {
      const field = req.query.field as 'id' | 'email' | 'cpf';
      const value = req.query.value as string;

      const has_user = await validateAccountService({
        field,
        value,
      });

      res.status(200).json({
        has_user,
      });
      return;
    } catch (error) {
      console.log(error);
      if (error instanceof HttpError)
        res.status(error.status).json({ message: error.message });
      return;
    }
  }

  public async create(req: Request, res: Response): Promise<void> {
    try {
      const body = req.body as CreateAccountBody;

      const user = await createAccountService(body);

      res.status(201).json({
        message: 'Conta criada com sucesso!',
        id: user.id,
      });
      return;
    } catch (error) {
      console.log(error);
      if (error instanceof HttpError)
        res.status(error.status).json({ message: error.message });
      return;
    }
  }

  public async update(req: Request, res: Response): Promise<void> {
    try {
      await updateAccountService(req.userId, req.body);
      res.status(200).send({ message: 'Usuário atualizado com sucesso' });
    } catch (error) {
      console.log(error);
      if (error instanceof HttpError)
        res.status(error.status).json({ message: error.message });
      return;
    }
  }

  public async accesses(req: Request, res: Response): Promise<void> {
    try {
      const accesses = await findAccessesService(req.userId);
      res.status(200).json(accesses);
      return;
    } catch (error) {
      console.log(error);
      if (error instanceof HttpError)
        res.status(error.status).json({ message: error.message });
      return;
    }
  }

  public async signWorkspace(req: Request, res: Response): Promise<void> {
    try {
      const { workspace_id } = req.body

      const workspace_token = await signWorkspaceService(workspace_id);

      res.status(200).json(workspace_token);
      return;
    } catch (error) {
      console.log(error);
      if (error instanceof HttpError)
        res.status(error.status).json({ message: error.message });
      return;
    }
  }


}

export default new AccountController();
