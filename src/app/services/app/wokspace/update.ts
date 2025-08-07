import Access from '@entities/Access';
import Workspace from '@entities/Workspace';
import { InternalServerError, NotFound } from '@utils/http/errors/controlled-errors';
import { HttpError } from '@utils/http/errors/http-errors';

interface UpdateWorkspaceData {
  name?: string;
  cnpj?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: {
    cep: string;
    number?: number;
    street: string;
    neighborhood: string;
    city: string;
    state: {
      acronym: string;
      name: string;
    };
  };
}

export default async function updateWorkspaceService(workspace_id: string, data: UpdateWorkspaceData): Promise<{ message: string }>{
  try {

    const workspace = await Workspace.findOne(workspace_id);

    if (!workspace) {
      throw new NotFound('Workspace não encontrado.');
    }

    const valuesToUpdate = {
      name: data.name || workspace.name,
      cnpj: data.cnpj || workspace.cnpj,
      phone: data.phone || workspace.phone,
      whatsapp: data.whatsapp || workspace.whatsapp,
      email: data.email || workspace.email,
      address: data.address || workspace.address,
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
