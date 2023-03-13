import { createRouter } from '@ravshansbox/mini-app';
import { createProduct } from './createProduct';
import { getProducts } from './getProducts';

export const productRouter = createRouter();

productRouter.addRoute(createProduct);
productRouter.addRoute(getProducts);
