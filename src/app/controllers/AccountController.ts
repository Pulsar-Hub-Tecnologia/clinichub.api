import { Request, Response } from 'express';
import Users from '@entities/User';
import emailValidator from '@utils/emailValidator';
import createAccountService from '../services/account/createAccount.service';
import { RequestNotComplete, UserAlreadyExistsError } from '../errors/controlled-errors';
import findAccountService from '../services/account/findAccount.service';

interface AccountInterface {
  id?: string;
  name: string;
  cpf: string;
  email: string;
  regional_council_number?: string;
  picture?: string;
  token: string;
  password: string;
  secret?: string;
}

interface WorkspaceInterface extends AccountInterface {
  type: string;
  workspaceName: string;
  cnpj?: string;
}

interface CreateAccountBody {
  workspace_type: "PERSONAL" | "BUSINESS";
  email: string;
  password: string;
  name: string;
  cpf: string;
  crm_number?: string;
  workspace_name?: string;
  cnpj?: string;
}

class AccountController {
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const body = req.body as CreateAccountBody

      const created_account = await createAccountService(body)

      res.status(201).json({
        message: 'Conta criada com sucesso!',
        user: {
          id: created_account.user.id,
          name: created_account.user.name,
          email: created_account.user.email,
          cpf: created_account.user.cpf,
          picture: created_account.user.picture,
          accesses: created_account.user.accesses
        },
        workspace: {
          id: created_account.workspace.id,
          name: created_account.workspace.name,
          cnpj: created_account.workspace.cnpj,
          picture: created_account.workspace.picture
        },
        access: {
          id: created_account.access.id,
          role: created_account.access.role
        }
      });
      return;

    } catch (error) {
      console.log(error)
      if (error instanceof RequestNotComplete) {
        res.status(400).json({ message: error.message })
        return;
      }

      if (error instanceof UserAlreadyExistsError) {
        res.status(409).json({ message: error.message })
        return;
      }

      res.status(500).json({ message: "Erro interno do servidor." });
      return;
    }
  }

  public async findAccount(req: Request, res: Response): Promise<void> {
    try {
      const field = req.query.field as "id" | "email" | "cpf";
      const value = req.query.value as string;

      await findAccountService({
        field,
        value
      })

      res.status(200).json({ message: "Usuário encontrado!" });
      return;
    } catch (error) {
      if (error instanceof RequestNotComplete) {
        res.status(400).json({ message: error.message })
        return
      }

      if (error instanceof UserAlreadyExistsError) {
        res.status(409).json({ message: error.message })
        return
      }

      res.status(500).json({ error: 'Erro interno ao localizar conta.' });
      return
    }
  }

  public async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, email }: AccountInterface = req.body;

      if (email && !emailValidator(email)) {
        res.status(400).json({ message: 'Formato de e-mail inválido.' });
        return;
      }

      const user = await Users.findOne(id);

      if (!user) {
        res.status(404).json({ message: 'Usuário não encontrado.' });
        return;
      }

      const valuesToUpdate = {
        name: name || user.name,
        email: email || user.email,
      };

      await Users.update(user.id, { ...valuesToUpdate });

      res.status(204).send({ message: 'Usuário atualizado com sucesso' });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Erro interno ao atualizar o usuário, tente novamente.',
      });
    }
  }
}

export default new AccountController();
