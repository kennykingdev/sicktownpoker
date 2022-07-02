import SchemaBuilder from '@pothos/core';
import { Player, Prisma } from '@prisma/client';
import PrismaPlugin from '@pothos/plugin-prisma';
import type PrismaTypes from '@/generated/pothos-types';

import prisma from '@/lib/clients/prisma';

const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes;
  Objects: { Player: Player };
}>({
  plugins: [PrismaPlugin],
  prisma: {
    client: prisma,
    dmmf: (prisma as unknown as { _dmmf: Prisma.DMMF.Document })._dmmf,
  },
});

builder.queryType({});

export default builder;
