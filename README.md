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

TODO:
- [Sentry] integration (optional)
- SQL integration with [Knex](http://knexjs.org/)
- Email/password account creation API routes with email confirmation
- Password reset via email
- JWT Authentication
- Authentication mocking in tests

