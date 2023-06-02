import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { paymentValidationSchema } from 'validationSchema/payments';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getPayments();
    case 'POST':
      return createPayment();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getPayments() {
    const data = await prisma.payment
      .withAuthorization({
        userId: roqUserId,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'payment'));
    return res.status(200).json(data);
  }

  async function createPayment() {
    await paymentValidationSchema.validate(req.body);
    const body = { ...req.body };

    const data = await prisma.payment.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
