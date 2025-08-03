import { getManager } from "typeorm";
import User from "@entities/User";
import sendMail from "../mail/sendEmail";
import bcryptjs from "bcryptjs";
import Workspace from "@entities/Workspace";
import Access from "@entities/Access";
import { firstName } from "@utils/formats";
import { HttpError } from "@src/app/errors/http-errors";
import { InternalServerError } from "@src/app/errors/internal-errors";
import { RequestNotComplete, UserAlreadyExistsError } from "@src/app/errors/controlled-errors";

interface CreateAccountProps {
  workspace_type: "PERSONAL" | "BUSINESS";
  email: string;
  password: string;
  name: string;
  cpf: string;
  crm_number?: string;
  workspace_name?: string;
  cnpj?: string;
}

export default async function createAccountService({ workspace_type, email, password, name, cpf, crm_number, workspace_name, cnpj }: CreateAccountProps): Promise<{ user: User; workspace: Workspace; access: Access }> {
  const queryRunner = getManager().connection.createQueryRunner();

  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    if (!workspace_type || !email || !password || !name || !cpf) {
      throw new RequestNotComplete("Dados incompletos!");
    }

    if (workspace_type === "PERSONAL") {
      if (!crm_number) throw new RequestNotComplete("Número do CRM não foi informado!");
    }

    if (workspace_type === "BUSINESS") {
      if (!workspace_name) throw new RequestNotComplete("Nome do Workspace não foi informado!");
      if (!cnpj) throw new RequestNotComplete("O CNPJ não foi informado!");
    }

    const user_already_exists = await queryRunner.manager.findOne(User, {
      where: [
        { email },
        { cpf }
      ]
    });

    if (user_already_exists) {
      throw new UserAlreadyExistsError("Usuário já existe!");
    }

    const password_hash = await bcryptjs.hash(password, 10);

    const createdUser = queryRunner.manager.create(User, {
      name: name,
      cpf: cpf,
      email: email,
      password_hash,
      regional_council_number: crm_number
    });
    await queryRunner.manager.save(createdUser);

    const created_workspace = queryRunner.manager.create(Workspace, {
      name: workspace_name,
      type: workspace_type,
      cnpj: cnpj,
    });
    await queryRunner.manager.save(created_workspace);

    const created_access = queryRunner.manager.create(Access, {
      user: createdUser,
      workspace: created_workspace,
      role: workspace_type === "PERSONAL" ? "OWNER" : "ADMIN"
    });
    await queryRunner.manager.save(created_access);

    await queryRunner.commitTransaction();

    const userName = firstName(name);
    const client = process.env.CLIENT_URL;

    sendMail('newUser', 'no-reply', `Bem vindo ao ClinicHUB, ${userName}!`, {
      client,
      name,
      email,
      password,
    });

    return {
      user: createdUser,
      workspace: created_workspace,
      access: created_access
    };
  } catch (error) {
    await queryRunner.rollbackTransaction();

    if (error instanceof HttpError) {
      throw error;
    }

    throw new InternalServerError("Falha interna!");

  } finally {
    await queryRunner.release();
  }
}