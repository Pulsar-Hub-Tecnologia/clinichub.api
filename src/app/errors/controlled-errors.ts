import { HttpError } from "./http-errors";

export class UserAlreadyExistsError extends HttpError {
  constructor(message = "O usuário já está cadastrado.") {
    super(409, message);
  }
}

export class RequestNotComplete extends HttpError {
  constructor(message = "Dados incompletos.") {
    super(400, message);
  }
}