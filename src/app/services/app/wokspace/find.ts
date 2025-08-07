import Workspace from '@entities/Workspace';
import { InternalServerError, NotFound } from '@utils/http/errors/controlled-errors';
import { HttpError } from '@utils/http/errors/http-errors';

export default async function findWorkspaceService(workspace_id: string): Promise<Workspace>{
  try {

    console.log('Workspace Sercixce find')
    
    const workspace = await Workspace.findOne(workspace_id);

    if (!workspace) {
      throw new NotFound('Workspace não encontrado.');
    }

    return workspace;

  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new InternalServerError(
      'Erro ao buscar workspace.',
    );
  }
}
