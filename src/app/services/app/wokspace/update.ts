import Access from '@entities/Access';
import Workspace from '@entities/Workspace';
import { InternalServerError, NotFound } from '@utils/http/errors/controlled-errors';
import { HttpError } from '@utils/http/errors/http-errors';

interface UpdateWorkspaceData{
  name?: string;
  cnpj?: string
}

export default async function updateWorkspaceService(workspace_id: string, data: UpdateWorkspaceData): Promise<{ message: string }>{
  try {

    const workspace = await Workspace.findOne(workspace_id);

    if (!workspace) {
      throw new NotFound('Workspace não encontrado.');
    }

    const valuesToUpdate = {
      name: data.name || workspace.name,
      email: data.cnpj || workspace.cnpj,
    };

    await Workspace.update(workspace.id, { ...valuesToUpdate });

    return { message: 'Workspace atualizado com sucesso.'}

  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new InternalServerError(
      'Erro ao atualizar Workspace',
    );
  }
}
