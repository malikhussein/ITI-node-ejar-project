import { Router } from "express";



const categoryRoutes = Router();


categoryRoutes.get('/', (req, res) => {
  res.send('Category route');
});



export default categoryRoutes;