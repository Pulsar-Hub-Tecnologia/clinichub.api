import User from '@entities/User';
import emailValidator from '@utils/emailValidator';
import {
  BadRequest,
  InternalServerError,
  NotFound,
} from '@utils/http/errors/controlled-errors';
import { HttpError } from '@utils/http/errors/http-errors';


interface WorkspaceAccesses {
  picture: string;
  workspace_id: string;
  type: string;
  name: string;
  role: string;
}

export default async function findAccessesService(id: string): Promise<WorkspaceAccesses[]> {

  try {
    const user = await User.findOne(id, {
      relations: ['accesses', 'accesses.workspace'],
    });

    if (!user) {
      throw new NotFound('Usuário não encontrado.');
    }

    const accesses = user.accesses.map((access) => ({
      picture: access.workspace.picture,
      workspace_id: access.workspace.id,
      type: access.workspace.type,
      name: access.workspace.name,
      role: access.role,
    }));


    return accesses
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new InternalServerError('Erro ao atualizar o usuário.');
  }
}
