# Opinionated NodeJS API with Koa Boilerplate

This repo contains a basic project based on NodeJS and Koa (and some other libs) implementing a basic API to manage TODOs. Obviously, you're not going to handle just TODOs in all your projet, so all the code is commented to be easily changed and adapted to your needs.

It's meant to be used with a front-end consuming the API like a mobile app or a SPA like [React](https://reactjs.org/) / [Angular](https://angular.io/) / [Vue](https://vuejs.org/index.html).

The project packs some useful things for your needs:

- [Koa](http://koajs.com/) with async/await code to handle asynchronous tasks
- [TypeScript](http://www.typescriptlang.org/) for awesome Developer Experience
- Separated routers with [Koa-Router](https://github.com/alexmingoia/koa-router)
- Object injection in Koa context when references in the URL (like /todo/12 inject Todo object with id 12 in `ctx`)
- Error middleware with custom error classes and asserts to handle basic errors like Not Found
- Tricky parts of code fully commented
- Routes testing with watch mode with [Jest](https://facebook.github.io/jest/)
- Code coverage
- [Eslint](https://eslint.org/) linting with pre-commit test and auto-fixing
- [Node-Config](https://github.com/lorenwest/node-config) for configuration and environment variable handling
- [Nodemon](https://github.com/remy/nodemon) to auto-reload your server when saving
- SQL integration with [Knex](http://knexjs.org/)

## Config

This project uses [node-config](https://github.com/lorenwest/node-config) to handle the different configuration options. I highly recommend you to read this module README to learn about the different ways to configure this project for different environments. The [config/local.js](config/local.js) file should be used for secrets in development.

## SQL

The SQL integration is made with [Knex](http://knexjs.org/). By default, only the sqlite adapter is installed but Knex allows you to use a lot of different SQL servers. You need to install the adapter for the server you're going to use, look at the documentation for more [information](http://knexjs.org/#Installation-node).

The sqlite adapter is primarly used as an in-memory portable database and shouldn't be used for production purposes. It's integrated by default because it's the simplest way to execute the tests as each Node process created by Jest will have it's own sqlite instance and each instance will be populated by the seed values before each test suite.

The SQL conf is located in each file of the [config](config) folder.

Migrations are handled by [Knex migration tool](http://knexjs.org/#Migrations). You can look at the default [todos migration file](migrations/20180327160540_todos.ts) for an example. Migrations are run before each test suite to initialize the sqlite database, and so the database is wiped clean, be careful to never use you production database when running the tests.

## TODO:

- [Sentry] integration (optional)
- SQL integration with [Knex](http://knexjs.org/)
- Email/password account creation API routes with email confirmation
- Password reset via email
- JWT Authentication
- Authentication mocking in tests
- CircleCI integration
- Continous Integration (Docker, Kubernetes)
