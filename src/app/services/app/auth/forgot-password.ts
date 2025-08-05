import Access from '@entities/Access';
import User from '@entities/User';
import { generateToken } from '@utils/auth/generateToken';
import {
  BadRequest,
  NotFound,
  Unauthorized,
} from '@utils/http/errors/controlled-errors';
import { HttpError } from '@utils/http/errors/http-errors';
import { InternalServerError } from '@utils/http/errors/internal-errors';
import bcrypt from 'bcryptjs';
import sendMail from '../../mail/sendEmail';

interface WorkspaceAccesses {
  picture: string;
  workspace_id: string;
  type: string;
  name: string;
  role: string;
}

interface Authentication {
  user: User;
  accesses: WorkspaceAccesses[];
  token: string;
}

export default async function authentication(
  email: string,
  password: string,
): Promise<Authentication> {
  try {
    if (!email) {
      res.status(400).json({ message: 'Valores inválidos para o usuário.' });
      return;
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ message: 'Usuário não encontrado' });
      return;
    }

    const token = crypto.randomBytes(20).toString('hex'); // token que será enviado via email.

    const now = new Date();
    now.setHours(now.getHours() + 1);

    await User.update(user.id, {
      token_reset_password: token,
      reset_password_expires: now,
    });

    const client = process.env.CLIENT_CONNECTION;

    // Envie o email e aguarde a conclusão antes de enviar a resposta
    const mail = await sendMail(
      'forgotPassword',
      'no-reply',
      'Recuperação de Senha',
      {
        client,
        name: user.name,
        token,
        email: user.email,
      },
    );

    return {
      user,
      accesses,
      token: generateToken(user),
    };
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new InternalServerError('Erro ao autenticar com a plataforma');
  }
}
