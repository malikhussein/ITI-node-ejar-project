import { Router } from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteAllUsers,
  deleteUser,
  searchUser,
} from '../controllers/user.controller.js';
import uploadProfilePicture from '../middleware/profilePictureUpload.middleware.js';
import {
  getProfilePicture,
  updateProfilePicture,
} from '../controllers/updateProfilePicture.controller.js';
const userRoutes = Router();

// Route to update user profile picture
// This route is protected by the authMiddleware, meaning only logged-in users can access it as the rest
userRoutes.put('/upload-profile-picture',authMiddleware, uploadProfilePicture.single('profilePicture'),updateProfilePicture);
userRoutes.get('/profile-picture', authMiddleware, getProfilePicture);
userRoutes.get('/', authMiddleware, getAllUsers);
userRoutes.get('/:id', authMiddleware, getUserById);
userRoutes.post('/search', authMiddleware, searchUser);
userRoutes.put('/:id', authMiddleware, updateUser);
userRoutes.delete('/', authMiddleware, deleteAllUsers);
userRoutes.delete('/:id', authMiddleware, deleteUser);

export default userRoutes;
