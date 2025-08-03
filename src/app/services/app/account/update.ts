import User from '@entities/User';
import emailValidator from '@utils/emailValidator';
import { BadRequest, NotFound } from '@utils/http/errors/controlled-errors';

export default async function updateUserService(id:string, body: any) {

  const { email, name, }: User = body;


  if (email && !emailValidator(email)) {
    throw new BadRequest('Formato de e-mail inválido.');
  }

  const user = await User.findOne(id);

  if (!user) {
    throw new NotFound('Formato de e-mail inválido.');
  }

  const valuesToUpdate = {
    name: name || user.name,
    email: email || user.email,
  };

  await User.update(user.id, { ...valuesToUpdate });

}
