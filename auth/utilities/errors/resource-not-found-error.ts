import { CustomError } from "./CustomError";

export class ResourceNotFoundError extends CustomError {
  statusCode: number = 404;
  constructor() {
    super("Resource not found");
    Object.setPrototypeOf(this, ResourceNotFoundError.prototype);
  }
  serializeErrors(): { message: string; field?: string | undefined }[] {
    return [
      { message: "The resource you are trying to access could not be found!" },
    ];
  }
}
