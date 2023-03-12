import { parseJsonBody, Route, sendJson } from '@ravshansbox/mini-app';
import { z } from 'zod';
import { checkPermission } from '../../common/checkPermission';
import { parseAccessToken } from '../../common/parseAccessToken';
import { createId } from '../../common/utils';
import { validate } from '../../common/validate';
import { prismaClient } from '../../prismaClient';

const paramsSchema = z.object({
  order_id: z.string().uuid(),
});

const bodySchema = z.object({
  product_id: z.string().uuid(),
});

export const createOrderItem: Route = {
  method: 'POST',
  path: '/:id/items',
  handler: async ({ pathParams, request, response }) => {
    const params = validate(paramsSchema, pathParams);
    const body = validate(bodySchema, await parseJsonBody(request));
    const accessToken = await parseAccessToken(request);
    const [order, product] = await Promise.all([
      prismaClient.order.findUniqueOrThrow({ where: { id: params.order_id } }),
      prismaClient.product.findUniqueOrThrow({ where: { id: body.product_id } }),
    ]);
    await Promise.all([
      checkPermission(order.company_id, accessToken.user_id),
      checkPermission(product.company_id, accessToken.user_id),
    ]);
    const orderItem = await prismaClient.orderItem.create({
      data: { id: createId(), order_id: params.order_id, product_id: body.product_id },
    });
    sendJson(response, orderItem, 201);
  },
};
