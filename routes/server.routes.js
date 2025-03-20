import { Router } from 'express';
import categoryRoutes from './category.routes.js';

const mainRouter = Router();



mainRouter.use('/category', categoryRoutes)

export default mainRouter;
