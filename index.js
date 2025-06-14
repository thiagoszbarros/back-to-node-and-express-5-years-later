import express from 'express';
import api from './src/infraestructure/routes/api.routes.js';
import 'dotenv/config'
import { globalExceptionHandler } from './src/infraestructure/middlewares/global-exception-handler.midleware.js';
import { requestResponseLogger } from './src/infraestructure/middlewares/log-request-response.middeware.js';

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(requestResponseLogger);

app.use('/api', api);

app.get('/', (_, res) => {
  res.send('hello world');
});

app.use(globalExceptionHandler);

app.listen(process.env.PORT || 3000);