import express from 'express';
import api from './app/routes/api.js';
import 'dotenv/config'

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', api);

app.get('/', (req, res) => {
  res.send('hello world');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);