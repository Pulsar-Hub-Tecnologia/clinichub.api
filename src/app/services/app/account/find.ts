import User from '@entities/User';
import { BadRequest,  InternalServerError, NotFound } from '@utils/http/errors/controlled-errors';
import { HttpError } from '@utils/http/errors/http-errors';

export default async function findAccount(id: string): Promise<User>{
  try {
    if (!id) {
      throw new BadRequest('Dados incompletos!');
    }

    const user = await User.findOne(id);

    if (!user) {
      throw new NotFound('Usuário não encontrado.');
    }

    return user
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new InternalServerError(
      'Erro ao buscar conta.',
    );
  }
}
