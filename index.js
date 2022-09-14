const express = require('express');
const cors = require('cors');
const xssClean = require('xss-clean');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { failed } = require('./src/helpers/response');
const { PORT } = require('./src/helpers/env');
const app = express();
app.use(xssClean());
app.use(cors());
app.use(bodyParser.json());
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
);
app.use(express.static('public'));

// router here
// app.use(require('./src/routes'));

app.get('/', (req, res) => {
  res.json(`Food Recipe Api v1.0`);
});

app.all('*', (req, res) => {
  failed(res, {
    code: 404,
    status: 'error',
    message: `Service unavailable`,
    error: [],
  });
});

const LISTEN_PORT = PORT || 4325;

app.listen(LISTEN_PORT, '0.0.0.0', () => {
  console.log(`service RUN at port ${LISTEN_PORT}`);
});
