import * as dotenv from 'dotenv';
dotenv.config();
// swagger configuration file
import setUpSwagger from './swagger.config';

export const allowDevMode  = (app) => {
  // only development configuration will work for test and development Environments
  if (process.env.NODE_ENV !== 'development' && process.env.NODE_ENV !== 'test') {
    return;
  }
  setUpSwagger(app);
  app.enableCors();
};
