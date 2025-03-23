import { Router } from 'express';
import * as authRoutesService from '../controllers/auth.controller.js';
import { validation } from '../middleware/joi.middleware.js';
import { signInJoiSchema, signUpJoiSchema } from '../config/joi.validation.js';
import { forgotPassword} from "../controllers/forgotPassword.controller.js";
import { resetPassword} from "../controllers/resetPassword.controller.js";
import upload from '../middleware/multer.middleware.js';
import { cleanupUploadedFiles } from '../middleware/cleanUploadedFiles.middleware.js';

const authRoutes = Router();

authRoutes.post(
  '/signUp',
  upload.fields([
    { name: 'idPictureFront', maxCount: 1 },
    { name: 'idPictureBack', maxCount: 1 },
  ]),
  cleanupUploadedFiles,        //  CLEANUP for Uploaded files (Must come before validation)
  validation(signUpJoiSchema), // Validate request
  authRoutesService.register   // Handle registration
);
authRoutes.post(
  '/login',
  validation(signInJoiSchema), 
  authRoutesService.login
);
// verify email
authRoutes.get('/verify/:token', authRoutesService.verifyEmail);

//  resetpassword flow
authRoutes.post("/forgot-password", forgotPassword);
authRoutes.post("/reset-password/:token", resetPassword); 



export default authRoutes;
