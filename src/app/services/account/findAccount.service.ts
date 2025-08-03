import User from "@entities/User";
import { RequestNotComplete, UserAlreadyExistsError } from "@src/app/errors/controlled-errors";
import { HttpError } from "@src/app/errors/http-errors";
import { InternalServerError } from "@src/app/errors/internal-errors";

interface FindAccountProps {
  field: "id" | "email" | "name" | "cpf";
  value: string
}

export default async function findAccountService({ field, value }: FindAccountProps) {
  try {
    if (!field || !value) {
      throw new RequestNotComplete("Dados incompletos!")
    }

    const user_exists = await User.findOne({
      where: {
        [field]: value
      }
    })

    if (user_exists) throw new UserAlreadyExistsError("Email inválido! Já existe uma conta com esse email!")

  } catch (error) {
    if (error instanceof HttpError) {
      throw error
    }

    throw new InternalServerError("Falha interna ao verificar se a conta existe!")
  }
}