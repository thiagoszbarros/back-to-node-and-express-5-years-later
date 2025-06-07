import express from 'express';
import api from './app/routes/api.js';
import 'dotenv/config'
import { globalExceptionHandler } from './app/middlewares/global-exception-handler.midleware.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', api);

app.get('/', (_, res) => {
  res.send('hello world');
});

app.use(globalExceptionHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT);