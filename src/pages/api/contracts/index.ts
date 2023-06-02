import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { contractValidationSchema } from 'validationSchema/contracts';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getContracts();
    case 'POST':
      return createContract();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getContracts() {
    const data = await prisma.contract
      .withAuthorization({
        userId: roqUserId,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'contract'));
    return res.status(200).json(data);
  }

  async function createContract() {
    await contractValidationSchema.validate(req.body);
    const body = { ...req.body };

    const data = await prisma.contract.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
