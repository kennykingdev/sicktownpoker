import SchemaBuilder from '@pothos/core';
import { Prisma, Player, Tournament } from '@prisma/client';
import PrismaPlugin from '@pothos/plugin-prisma';
import type PrismaTypes from '@/generated/pothos-types';
import { DateTimeResolver } from 'graphql-scalars';

import prisma from '@/server/db/prisma';

const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes;
  Objects: { Player: Player; Tournament: Tournament };
  Scalars: {
    Date: {
      Input: Date;
      Output: Date;
    };
  };
}>({
  plugins: [PrismaPlugin],
  prisma: {
    client: prisma,
    dmmf: (prisma as unknown as { _dmmf: Prisma.DMMF.Document })._dmmf,
  },
});

builder.addScalarType('Date', DateTimeResolver, {});

builder.queryType({});
builder.mutationType({});

export default builder;
