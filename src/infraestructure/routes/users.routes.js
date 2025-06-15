import express from 'express';
import usersService from '../../app/users/users.service.js';
import { auth } from '../middlewares/auth.midleware.js';
import { admin } from '../middlewares/admin.midleware.js';
import { createUserRequest } from '../../app/users/create-user.request.js';
import { updateUserRequest } from '../../app/users/update-user.request.js';
import User from '../../app/users/users.schema.js';
import bcrypt from 'bcrypt';

const users = express();

const service = usersService({
    repository: User,
    encrypter: bcrypt
});

users.get('/', auth, admin, service.index);
users.get('/:id', auth, admin, service.show);
users.post('/', auth, admin, createUserRequest, service.store);
users.put('/:id', auth, admin, updateUserRequest, service.update);
users.delete('/:id', auth, admin, service.destroy);

export default users;
