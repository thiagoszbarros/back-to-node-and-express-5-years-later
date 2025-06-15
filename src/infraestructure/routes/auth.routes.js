import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import express from 'express';
import authService from '../../app/auth/auth.service.js';
import User from '../schemas/users.schema.js';
import { passwordResetRequest } from '../requests/auth/password-reset.request.js';
import { passwordResetTokenRequest, } from '../requests/auth/password-reset-token.request.js';

const auth = express();

const service = authService({
  repository: User,
  encrypter: bcrypt,
  jwtLib: jwt,
  cryptoLib: crypto
});

auth.post('/register', service.register);
auth.post('/login', service.login);
auth.post('/password/reset/token', passwordResetTokenRequest, service.passwordResetToken);
auth.post('/password/reset', passwordResetRequest, service.passwordReset);

export default auth;
