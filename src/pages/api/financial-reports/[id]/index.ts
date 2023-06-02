import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { financialReportValidationSchema } from 'validationSchema/financial-reports';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId } = await getServerSession(req);
  await prisma.financial_report
    .withAuthorization({ userId: roqUserId })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getFinancialReportById();
    case 'PUT':
      return updateFinancialReportById();
    case 'DELETE':
      return deleteFinancialReportById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getFinancialReportById() {
    const data = await prisma.financial_report.findFirst(convertQueryToPrismaUtil(req.query, 'financial_report'));
    return res.status(200).json(data);
  }

  async function updateFinancialReportById() {
    await financialReportValidationSchema.validate(req.body);
    const data = await prisma.financial_report.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    return res.status(200).json(data);
  }
  async function deleteFinancialReportById() {
    const data = await prisma.financial_report.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
