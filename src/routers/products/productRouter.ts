import { createRouter } from '../../common/createRouter';
import { createProduct } from './createProduct';

export const productRouter = createRouter();

productRouter.addRoute(createProduct);
