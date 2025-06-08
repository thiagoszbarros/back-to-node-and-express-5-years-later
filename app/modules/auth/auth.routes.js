import express from 'express';
import { register, login, passwordResetToken, resetPassword } from './auth.service.js';
import { passwordResetRequest } from './password-reset.request.js';
import { passwordResetTokenRequest, } from './password-reset-token.request.js';

const auth = express();

auth.post('/register', register);
auth.post('/login', login);
auth.post('/password/reset/token', passwordResetTokenRequest, passwordResetToken);
auth.post('/password/reset', passwordResetRequest, resetPassword);

export default auth;
