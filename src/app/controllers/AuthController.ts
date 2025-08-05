import User from '@entities/User';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { generateToken } from '@utils/auth/generateToken';
import sendMail from '@src/app/services/mail/sendEmail';
import authentication from '../services/app/auth/authentication';

dotenv.config();

interface UserInterface {
  name: string;
  email: string;
  token: string;
  password: string;
  secret?: string;
  tempToken?: string;
}
/**
 * @swagger
 * tags:
 *   name: Autenticação
 *   description: Operações relativas à autenticação
 */

class AuthController {

  public async authenticate(req: Request, res: Response): Promise<void> {
    try {
      const { email, password }: UserInterface = req.body;

      const auth = await authentication(email, password)

      res.status(200).json(auth);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro interno na autenticação.' });
    }
  }

  public async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email }: UserInterface = req.body;

      // Envie a resposta após o envio do email
      res
        .status(200)
        .json({ message: 'E-mail de recuperação de senha enviado.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro interno na autenticação.' });
    }
  }

  public async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, token }: UserInterface = req.body;

      if (!email || !password || !token) {
        res
          .status(400)
          .json({ message: 'Valores inválidos para redefinição de senha' });
        return;
      }
      const user = await User.findOne({ email });

      if (!user) {
        res.status(404).json({ message: 'Usuário não encontrado' });
        return;
      }
      if (token !== user.token_reset_password) {
        res.status(404).json({ message: 'Token inválido' });
        return;
      }
      const now = new Date();

      if (now > user.reset_password_expires) {
        res.status(400).json({ message: 'Token expirado' });
        return;
      }
      const password_hash = await bcrypt.hash(password, 10);

      await User.update(user.id, {
        password_hash,
        reset_password_expires: undefined,
        token_reset_password: undefined,
      });

      res.status(200).json({ message: 'Senha alterada com sucesso ' });
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: 'Cannot reset password, try again' });
    }
  }
}

export default new AuthController();
