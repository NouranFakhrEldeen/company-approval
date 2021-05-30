## Installation

```bash
$ npm install
```

**Note**: this application need to install MS SQL Server 

you can install it or just install its [docker image](https://hub.docker.com/_/microsoft-mssql-server)

then add these .env variables to the project with the working database configuration
DB_HOST=<server_host>
DB_PORT=<server_port>
DB_NAME=<working_database>
DB_USERNAME=<auth_server_username>
DB_PASSWORD=<auth_server_password>

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
