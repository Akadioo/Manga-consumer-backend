import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

export function handleError(
  error: unknown,
  notFoundMessage = 'Recurso no encontrado',
  internalMessage = 'Error consultando la base de datos',
): never {
  this.logger.error(`Error capturado: ${JSON.stringify(error)}`);
  if (error instanceof NotFoundException)
    throw new NotFoundException(notFoundMessage);
  if (error instanceof BadRequestException) throw error;
  throw new InternalServerErrorException(internalMessage);
}
