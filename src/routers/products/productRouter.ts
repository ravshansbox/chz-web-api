import { createRouter } from '@ravshansbox/mini-app';
import { createProduct } from './createProduct';

export const productRouter = createRouter();

productRouter.addRoute(createProduct);
