import { ApplicationError } from '@app/error/ApplicationError';
import { PrismaClient } from '@prisma/client';

export interface IHandler<T> {
  setNext(handler: IHandler<T>): void;
  handle(userDTO: T, prisma: PrismaClient): void;
}

export abstract class BaseHandler<T> implements IHandler<T> {
  protected next: IHandler<T> | null = null;
  setNext(handler: IHandler<T>): void {
    this.next = handler;
  }
  handle(dto: T, prisma: PrismaClient): void {
    if (this.next) {
      this.next.handle(dto, prisma);
    }
    throw new ApplicationError('Wrong User role', 400);
  }
}
