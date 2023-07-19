import { PrismaClient } from '@prisma/client';
import { ITXClientDenyList } from '@prisma/client/runtime';

export type TrxClient = Omit<PrismaClient, ITXClientDenyList>;
