import { type PermissionType } from '@prisma/client';
import { prismaClient } from '../prismaClient';

export const checkPermission = async (
  company_id: string,
  user_id: string,
  type?: PermissionType,
) => {
  const permission = await prismaClient.permission.findUnique({
    where: { company_id_user_id: { company_id, user_id } },
  });
  if (permission === null || (typeof type !== 'undefined' && permission.type !== type)) {
    throw new Error(`User ${user_id} needs ${type} permission on ${company_id}`);
  }
};
