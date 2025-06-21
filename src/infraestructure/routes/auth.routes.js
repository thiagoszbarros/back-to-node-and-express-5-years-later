import express from 'express';
import authController from '../controllers/auth.controller.js';
import User from '../schemas/users.schema.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { passwordResetRequest } from '../requests/auth/password-reset.request.js';
import { passwordResetTokenRequest } from '../requests/auth/password-reset-token.request.js';

const auth = express();

const controller = authController({
  repository: User,
  encrypter: bcrypt,
  jwtLib: jwt,
  cryptoLib: crypto
});

auth.post('/register', controller.register);
auth.post('/login', controller.login);
auth.post('/password/reset/token', passwordResetTokenRequest, controller.passwordResetToken);
auth.post('/password/reset', passwordResetRequest, controller.passwordReset);

export default auth;
