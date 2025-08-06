import User from '@entities/User';
import Workspace from '@entities/Workspace';
import { generateToken } from '@utils/auth/generateToken';
import emailValidator from '@utils/emailValidator';
import {
  BadRequest,
  InternalServerError,
  NotFound,
} from '@utils/http/errors/controlled-errors';
import { HttpError } from '@utils/http/errors/http-errors';


export default async function signWorkspaceService(workspace_id: string): Promise<string> {

  try {

    if (!workspace_id) {
      throw new BadRequest('workspace_id não informado');
    }

    const workspace = await Workspace.findOne(workspace_id)

    if(!workspace){
      throw new NotFound('Workspace não encontrado')
    }

    return generateToken({ workspace_id: workspace.id })
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new InternalServerError('Erro ao atualizar o usuário.');
  }
}
