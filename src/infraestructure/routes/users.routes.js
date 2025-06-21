import express from 'express';
import usersController from '../controllers/users.controller.js';
import User from '../schemas/users.schema.js';
import bcrypt from 'bcrypt';
import { auth } from '../middlewares/auth.midleware.js';
import { admin } from '../middlewares/admin.midleware.js';
import { createUserRequest } from '../requests/users/create-user.request.js';
import { updateUserRequest } from '../requests/users/update-user.request.js';

const users = express();

const controller = usersController({
  repository: User,
  encrypter: bcrypt
});

users.get('/', auth, admin, controller.index);
users.get('/:id', auth, admin, controller.show);
users.post('/', auth, admin, createUserRequest, controller.store);
users.put('/:id', auth, admin, updateUserRequest, controller.update);
users.delete('/:id', auth, admin, controller.destroy);

export default users;
