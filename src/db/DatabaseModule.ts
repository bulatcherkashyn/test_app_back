import { PrismaClient } from '@prisma/client';
import { container } from 'tsyringe';

import { prisma } from './db.implementation';
export class DatabaseModule {
  static async initialize(): Promise<void> {
    container.register<PrismaClient>('PrismaClient', {
      useValue: prisma,
    });
  }
}
