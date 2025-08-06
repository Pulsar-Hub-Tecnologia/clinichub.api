import Access from '@entities/Access';
import { InternalServerError, NotFound } from '@utils/http/errors/controlled-errors';
import { HttpError } from '@utils/http/errors/http-errors';


interface AccessUser {
  id: string;
  user_name: string;
  user_email: string;
  role: string;
}

export default async function findAccessService(access_id: string): Promise<AccessUser>{
  try {
    const access = await Access.findOne(access_id, { relations: ['user'] });

    if (!access) {
      throw new NotFound('Acesso não encontrado.');
    }

    const user: AccessUser = {
      id: access.id,
      user_name: access.user.name,
      user_email: access.user.email,
      role: access.role,
    };

    return user;

  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new InternalServerError(
      'Erro ao buscar acesssos.',
    );
  }
}
