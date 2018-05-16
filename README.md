<p align="center">
  <img src="./misc/logo.svg" width="500" />
</p>

<p align="center">
  A <em>batteries included</em> NodeJS API Kickstater<br/>
  focused on extensability and developer productivity.
</p>

<p align="center">
  <a href="#whatsinside">What's inside?</a> •
  <a href="#requirements">Requirements</a> •
  <a href="#usage">Usage</a> •
  <a href="#an-awesome-developer-experience-just-for-you">Developer experience</a> •
  <a href="#customizing-it">Customizing it</a> •
  <a href="#troubleshooting">Troubleshooting</a> •
  <a href="#todo">TODO</a> •
</p>

<p align="center">
  <a href="https://circleci.com/gh/geekuillaume/nodejs-api-kickstarter">
    <img src="https://img.shields.io/circleci/project/github/geekuillaume/nodejs-api-kickstarter.svg">
  </a>
  <a href="https://circleci.com/gh/geekuillaume/nodejs-api-kickstarter">
    <img src="https://circleci.com/gh/geekuillaume/nodejs-api-kickstarter.svg?style=svg">
  </a>
  <a href="./LICENSE.md">
    <img src="https://img.shields.io/github/license/geekuillaume/nodejs-api-kickstarter.svg">
  </a>
  <a href="http://makeapullrequest.com">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square">
  </a>
</p>

<br/>
<br/>

This is a project based on NodeJS and Koa (and some other libs) implementing a REST API to authenticate users and let them manage TODOs stored in a SQL database. It's easy to extend and provides you the best developer experience possible with a lot of nifty things already configured.

It's meant to be used with a front-end consuming the API like a mobile app or a SPA built with for example [React](https://reactjs.org/), [Angular](https://angular.io/) or [Vue](https://vuejs.org/index.html).

## What's inside?

- [Koa](http://koajs.com/) with async/await code to handle asynchronous tasks
- [TypeScript](http://www.typescriptlang.org/) for awesome Developer Experience
- SQL integration with [Knex](http://knexjs.org/)
- Email/password account creation API routes
- Compatibility to add other OAuth providers as login methods and merge of multiple auth providers for a single account
- Account confirmation with a link sent by email
- Email sending with your SMTP server (and templating also included)
- Separated routers with [Koa-Router](https://github.com/alexmingoia/koa-router)
- Object injection in Koa context when references in the URL (like `/todo/12` injects the Todo object with id 12 in `ctx.todo`)
- Error middleware with custom error classes and asserts to handle basic errors like Not Found
- Routes testing with watch mode with [Jest](https://facebook.github.io/jest/)
- Code coverage
- [Eslint](https://eslint.org/) linting with pre-commit test and auto-fixing
- [Node-Config](https://github.com/lorenwest/node-config) for configuration and environment variable handling
- [Nodemon](https://github.com/remy/nodemon) to auto-reload your server when saving
- Tricky parts of code fully commented
- Kubernetes Deployement with PostgreSQL
- Continuous integration / deployement with CircleCI
- Separated env on Kubernetes for each branch

## Requirements

- NodeJS (tested on v9.10.0): [Installation](https://nodejs.org/en/download/package-manager/)
- Git

## Usage

To start working on this project, you need to make a private copy of it:

- Clone it on your computer: `git clone https://github.com/geekuillaume/koa-boilerplate.git`
- If you are using Github, [create a repository](https://github.com/new) and set the origin in git with `git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME`
- Change the informations about the code in the [package.json](package.json) file
- Add and commit the changed `package.json`: `git add package.json` then `git commit`
- Push the repository content to your new repo with `git push origin master`

The server comes packed with some useful commands (defined in `package.json`):

- `npm run test`: Launch the Jest test suite
- `npm run test:watch`: Launch the Jest test suite in watch mode (the tests are executed after each file change)
- `npm run test:coverage`: Launch the Jest test suite and save coverage information in the `coverage` folder
- `npm run watch`: Start the project in watch mode, restarting it after each file change
- `npm run lint`: Analyze the project code with ESlint and show coding style errors (executed before each commit)
- `npm run doc:generate`: Generate the documentation in the `apiDoc` folder

## An awesome developer experience just for you


### Watch tests

<img src="./misc/watch_tests.gif">

### Email preview

<img src="./misc/email_preview.gif">

### Pre-commit linting

<img src="./misc/precommit_eslint.gif">


## Customizing it

### Config

This project uses [node-config](https://github.com/lorenwest/node-config) to handle the different configuration options. I highly recommend you to read this module README to learn about the different ways to configure this project for different environments. The [config/local.js](config/local.js) file should be used for secrets in development.

### SQL

The SQL integration is made with [Knex](http://knexjs.org/). By default, only the sqlite adapter is installed but Knex allows you to use a lot of different SQL servers. You need to install the adapter for the server you're going to use, look at the documentation for more [information](http://knexjs.org/#Installation-node).

The sqlite adapter is primarly used as an in-memory portable database and shouldn't be used for production purposes. It's integrated by default because it's the simplest way to execute the tests as each Node process created by Jest will have it's own sqlite instance and each instance will be populated by the seed values before each test suite.

The SQL conf is located in each file of the [config](config) folder.

Migrations are handled by [Knex migration tool](http://knexjs.org/#Migrations). You can look at the default [todos migration file](migrations/20180327160540_todos.ts) for an example. Migrations are run before each test suite to initialize the sqlite database, and so the database is wiped clean, be careful to never use you production database when running the tests. To create a new migration, use the `npm run db:createMigration -- YOUR_MIGRATION_NAME` command. It will create a new file in the [migrations/](migrations) folder that you should use to define your migration steps. To run all non executed migrations, use the `npm run db:migrate` command.

### Email

This project includes a service to send emails to your users. It's used to send the activation link after the account creation and send the "Forgot password" link. In development mode, you can use the [Ethereal.email](https://ethereal.email) service to debug the emails your sending without really having to send them. I've included the instructions about how to create an account in the [config/development.js](config/development.js) file.

The email service uses the [Nodemailer](https://nodemailer.com/about/) module and is compatible with all SMTP transactional email service providers. To get more information about how you can configure it for you own usage, look at the [documentation](https://nodemailer.com/smtp/).

### Account activation

By default, every account created with an email/password combo is not active. It means that the user is in a read-only mode (you can change this behaviour according to your needs). To activate its account, the user should click the link in the email sent to his email address. This link points to the API that will redirect the user with a `302` to the URL specified in the `activateCallbackUrl` config variable. The auth token will be appended to this `activateCallbackUrl` as a `?auth_token=` query string. For example, if your `activateCallbackUrl` is `https://app.example.com/after_activation`, the user will be redirected to `https://app.example.com/after_activation?auth_token=AUTHENTICATION_TOKEN_FOR_THE_USER`. This token can then be used like a regular authentication token to access other API routes.

### UUID

Everywhere in this project, UUIDs are used instead of the classic auto-incremental integers IDs. This way you don't expose the number of elements in your db (like the number of users of your API). It can also help prevent bugs in your code as you cannot guess the id of a specific object and so cannot directly target it.

### Documentation

The `npm run doc:generate` command can be used to execute the script to generate the documentation in the `apiDoc` folder. Here's an example of the resulting documentation: [ApiDoc](https://rawgit.com/geekuillaume/nodejs-api-kickstarter/master/apiDoc/index.html).

You should look at the dedicated [README](misc/internals/docsComponents/README.md) for more information.

## Kubernetes Deployement

A fully-fonctional [Helm](https://helm.sh/) chart is provided in this project to deploy this project. It will deploy PostgreSQL and the API on your Kubernetes cluster. A CircleCI integration is also provided to deploy the API on each push and create new environments on each branch creation. The configuration doesn't depend on a specific Cloud service and you can deploy it to bare metal servers. No GCloud or AWS load-balancers are used (could be a limitation).

To start using it, you first need a Kubernetes Cluster accessible from the outside world. It can be a little hard to get a good source about how to deploy a cluster from scratch when you don't have any Kubernetes experience. I used [Rancher](https://rancher.com/) to deploy one and I highly recommend it. You also need to have [Helm](https://docs.helm.sh/using_helm/#installing-helm) and [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/) installed on your machine.

If you use Rancher or have a Nginx Ingress Controller installed (Rancher install by default), you can easily add [Let's Encrypt](https://letsencrypt.org/) integration with [cert-manager](https://github.com/jetstack/cert-manager) to get free SSL on your API. To do so, install the cert-manager helm chart with `helm install --name cert-manager stable/cert-manager`. You then need to create a ClusterIssuer ressource on your K8S cluster. I've included an [example file](misc/clusterissuer.yaml) that you should edit to include your email address (replace `YOUR_EMAIL_ADDRESS`), then create the ressource with `kubectl create -f ./misc/clusterissuer.yaml`.

Next, we need a Docker Registry to host the Docker images that we will build (or that CircleCI will build for us). You can use the public Docker registry but if you are not creating an open-source project you probably want a private Docker Registry. I've included a [file](misc/docker_registry.yaml) containing the basic values needed to deploy a registry on your Kubernetes Cluster. You need to edit it (`misc/docker_registry.yaml`) to include your hostname (something like `registry.your-awesome-project.com`) and you username/password combo (the command needed to get the secret is documented in the file comments), then install it with `helm install stable/docker-registry --name registry --namespace registry -f ./misc/docker_registry.yaml`. You can now authentify your local Docker client with `docker login YOUR_REGISTRY_HOSTNAME`.

By default, Helm execute your SQL migrations on install and on each upgrade. This can be a behaviour that you don't want if you need to control the way it's executed. You can switch `autoMigrate` to `false` in the `helm/values.yaml` file to disable it.

When you install for the first time a release, a new JWT secret is created. To get more information about how to access it, use the `helm status [YOUR_RELEASE_NAME]` command. To get the releases installed, use the `helm ls` command.

Now, you can either build and deploy the API from your own computer or configure CircleCI to do it for you.

I've included a functional CircleCI [configuration file](.circleci/config.yml) that will test the code, generate the test coverage and save it as [artifacts](https://circleci.com/docs/2.0/artifacts/), build the docker image, push it to your Docker Registry and use Helmfile to upgrade or install the API. All branch will be deployed on Kubernetes, each on a new subdomain with a new instance of the database. You should configure the domain names for the master and the other branches in `helmfile.yaml`. You also need to add 4 environment variables in your project CircleCI configuration:

- DOCKER_REGISTRY: the hostname of your registry
- DOCKER_USER: the username you used to generate the secret in `misc/docker_registry.yaml`
- DOCKER_PASSWORD: the password you used to generate the secret in `misc/docker_registry.yaml`
- KUBE_CONFIG: your kubectl config, you can get it from your own machine in `$HOME/.kube/config`. You need to convert it to JSON because we loose newlines in the env variable. To do so, use an online service like [json2yaml](https://www.json2yaml.com/).

Once it's done, you just have to launch a build from the CircleCI interface or push to Github to trigger a build.

To deploy it from your dev machine or to adapt the CI process to another CI provider. I suggest that you take a look at the `.circleci/config.yml` file to get a sense of what it is doing.

## Troubleshooting

### I need to reauth after restarting my server

This is because you didn't change the `jwtSecret` in you config file. Add a `jwtSecret` in your `config/local.js` file with a random string (at least 15 characters).

## TODO:

- [Sentry] integration (optional)
- Password reset via email
- Upload coverage and documentation to AWS S3
- Prometheus integration
- Adding info in helm NOTES.txt
