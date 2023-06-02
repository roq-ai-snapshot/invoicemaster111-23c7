import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { organizationUserValidationSchema } from 'validationSchema/organization-users';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId } = await getServerSession(req);
  await prisma.organization_user
    .withAuthorization({ userId: roqUserId })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getOrganizationUserById();
    case 'PUT':
      return updateOrganizationUserById();
    case 'DELETE':
      return deleteOrganizationUserById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getOrganizationUserById() {
    const data = await prisma.organization_user.findFirst(convertQueryToPrismaUtil(req.query, 'organization_user'));
    return res.status(200).json(data);
  }

  async function updateOrganizationUserById() {
    await organizationUserValidationSchema.validate(req.body);
    const data = await prisma.organization_user.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    return res.status(200).json(data);
  }
  async function deleteOrganizationUserById() {
    const data = await prisma.organization_user.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
