import { Router } from 'express';
import categoryRoutes from './category.routes.js';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';

const mainRouter = Router();

mainRouter.use('/category', categoryRoutes);
mainRouter.use('/auth', authRoutes);
mainRouter.use('/user', userRoutes);
mainRouter.use('/review', authRoutes);

export default mainRouter;
