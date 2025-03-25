import { Router } from 'express';
import categoryRoutes from './category.routes.js';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import reviewRoutes from './review.routes.js';
import Productrouter from './product.routes.js';

const mainRouter = Router();
mainRouter.use("/product", Productrouter);

mainRouter.use('/category', categoryRoutes);
mainRouter.use('/auth', authRoutes);
mainRouter.use('/user', userRoutes);
mainRouter.use('/review', reviewRoutes);

export default mainRouter;
