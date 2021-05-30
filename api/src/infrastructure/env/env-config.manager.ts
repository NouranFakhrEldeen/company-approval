import * as dotenv from 'dotenv';
dotenv.config();

import * as DEFAULT from './default.json';

import * as TEST from './test.json';
import * as DEVELOPMENT from './development.json';
import * as STAGING from './staging.json';
import * as PRODUCTION from './production.json';

const configObj = {
    test: TEST,
    development: DEVELOPMENT,
    staging: STAGING,
    production: PRODUCTION,
};

export const config = configObj[process.env.NODE_ENV] || DEFAULT;
