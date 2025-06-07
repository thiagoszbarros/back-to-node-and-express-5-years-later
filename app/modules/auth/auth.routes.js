import express from 'express';
import { register, login } from './auth.service.js';

const auth = express();

auth.post('/register', register);
auth.post('/login', login);

export default auth;
