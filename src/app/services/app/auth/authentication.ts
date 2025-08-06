import Access from '@entities/Access';
import User from '@entities/User';
import { generateToken } from '@utils/auth/generateToken';
import {
  BadRequest,
  InternalServerError,
  NotFound,
  Unauthorized,
} from '@utils/http/errors/controlled-errors';
import { HttpError } from '@utils/http/errors/http-errors';
import bcrypt from 'bcryptjs';

interface WorkspaceAccesses {
  picture: string;
  workspace_id: string;
  type: string;
  name: string;
  role: string;
}

interface Authentication {
  user: { id: string; name: string; email: string; cpf: string };
  accesses: WorkspaceAccesses[];
  token: string;
}

export default async function authentication(
  email: string,
  password: string,
): Promise<Authentication> {
  try {
    if (!email || !password) {
      throw new BadRequest('Dados inválidos.');
    }

    const user = await User.findOne({
      where: { email },
      relations: ['accesses', 'accesses.workspace'],
    });

    if (!user) {
      throw new NotFound('Usuário não encontrado.');
    }

    if (!(await bcrypt.compare(password, user.password_hash))) {
      throw new Unauthorized('Senha inválida');
    }

    const accesses = user.accesses.map((access) => ({
      picture: access.workspace.picture,
      workspace_id: access.workspace.id,
      type: access.workspace.type,
      name: access.workspace.name,
      role: access.role,
    }));

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        cpf: user.cpf,
      },
      accesses,
      token: generateToken({ id: user.id }),
    };
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new InternalServerError('Erro ao autenticar com a plataforma');
  }
}
