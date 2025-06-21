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

app.get('/', async (_, res) => {
  let version = '0.0.0';

  const { execSync } = await import('child_process');
  
  try {
    version = execSync('git describe --tags --abbrev=0').toString().trim();
  } catch {}

  res.json({
    message: 'Application is available',
    version
  });
});

app.use(globalExceptionHandler);

app.listen(process.env.PORT || 3000);