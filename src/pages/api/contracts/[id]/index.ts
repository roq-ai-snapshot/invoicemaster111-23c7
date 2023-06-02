import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { contractValidationSchema } from 'validationSchema/contracts';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId } = await getServerSession(req);
  await prisma.contract
    .withAuthorization({ userId: roqUserId })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getContractById();
    case 'PUT':
      return updateContractById();
    case 'DELETE':
      return deleteContractById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getContractById() {
    const data = await prisma.contract.findFirst(convertQueryToPrismaUtil(req.query, 'contract'));
    return res.status(200).json(data);
  }

  async function updateContractById() {
    await contractValidationSchema.validate(req.body);
    const data = await prisma.contract.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    return res.status(200).json(data);
  }
  async function deleteContractById() {
    const data = await prisma.contract.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
