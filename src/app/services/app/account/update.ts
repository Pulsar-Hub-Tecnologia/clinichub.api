import User from '@entities/User';
import emailValidator from '@utils/emailValidator';
import { BadRequest, InternalServerError, NotFound } from '@utils/http/errors/controlled-errors';
import { HttpError } from '@utils/http/errors/http-errors';


export default async function updateAccountService(id: string, body: any) {
  const { email, name }: User = body;

  try {
    if (email && !emailValidator(email)) {
      throw new BadRequest('Formato de e-mail inválido.');
    }

    const user = await User.findOne(id);

    if (!user) {
      throw new NotFound('Usuário não encontrado.');
    }

    const valuesToUpdate = {
      name: name || user.name,
      email: email || user.email,
    };

    await User.update(user.id, { ...valuesToUpdate });
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new InternalServerError('Erro ao atualizar o usuário.');
  }
}
