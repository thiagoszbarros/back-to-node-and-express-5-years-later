import express from 'express';
import { index, show, store, update, destroy } from './users.service.js';
import { auth } from '../../middlewares/auth.midleware.js';
import { admin } from '../../middlewares/admin.midleware.js';
import { createUserRequest } from './create-user.request.js';
import { updateUserRequest } from './update-user.request.js';

const users = express();

users.get('/', auth, admin, index);
users.get('/:id', auth, admin, show);
users.post('/', auth, admin, createUserRequest, store);
users.put('/:id', auth, admin, updateUserRequest, update);
users.delete('/:id', auth, admin, destroy);

export default users;
