// import packages
import express from 'express';
import chalk from 'chalk';
import cors from 'cors';
import http from 'http';

// import project's internal modules and functions
import startDB from './models/db.js';
import { initializeSocketIO } from './socket/index.js';
import { createDefaultAdmin } from './services/super-admin.service.js';
import {
  createStripeAddons,
  createStripeProducts,
} from './services/payment.service.js';
import * as routes from './routes/index.js';

// create an expressjs app
const app = express();
// create a new socket instance
const httpServer = http.createServer(app);
initializeSocketIO(httpServer);

// Initialize database connection
startDB();

// Initialize default items
// createDefaultAdmin();
// createStripeProducts();
// await createStripeAddons();

// express server settings
app.use(cors());
app.use(express.json({ limit: '50mb', extended: true }));
app.use(
  express.urlencoded({
    limit: '50mb',
    parameterLimit: 1000000,
    extended: true,
  })
);
app.use(express.static('../uploads/media'));
app.use('/', routes.router);

// Testing base url
app.get('/', (req, res) => {
  console.log('Driver-R is Up!');
  res.send('Driver-R is Up!');
});

// http server as a socket server
httpServer.listen(process.env.PORT || 5002, () => {
  console.log(
    chalk.blue(
      ` 🚀 Driver-R server listening on port: ${process.env.PORT}!`
    )
  );
});

// export the default app
export default app;
