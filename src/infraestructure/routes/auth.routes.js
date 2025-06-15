import express from 'express';
import { register, login, passwordResetToken, passwordReset } from '../../app/auth/auth.service.js';
import { passwordResetRequest } from '../requests/auth/password-reset.request.js';
import { passwordResetTokenRequest, } from '../requests/auth/password-reset-token.request.js';

const auth = express();

auth.post('/register', register);
auth.post('/login', login);
auth.post('/password/reset/token', passwordResetTokenRequest, passwordResetToken);
auth.post('/password/reset', passwordResetRequest, passwordReset);

export default auth;
