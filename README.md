# Replenisher Task List Challenge

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

You will need to first clone the repository and then follow the instructions for installing found below.

You need an up-to-date version of Docker to run Prisma locally. You can find installation instructions for the free Docker Community Edition (CE) on https://www.docker.com/community-edition

### Installing

```
npm install -g @vue-cli
npm install -g prisma 
npm install -g graphql-cli
cd task-list-server/database
run docker-compose up -d
primsa deploy
```

## Running the application locally

```
cd task-list
yarn start
cd ../task-list-server
yarn start
```

At this point the server should be running on localhost:4000 and you can access the site by going to [localhost:8080/#/login](localhost:8080/#/login)
The database has been seeded with the admin account email: "admin@dev.com" and password: "nooneknows". Login with these credentials to test out the application.

## Running the tests

The automated tests are run through a package called ava. Scripts have been set up in the package.json for you. The tests start a local server running in the background, if for some reason the tests fails you will need to call the `cleanup-test` or `kill-server` command to stop it running (normally this is taken care of by the `test` command).

```
yarn test
yarn cleanup-test
yarn kill-server
```

## Built With
* [VueJS](https://vuejs.org/) - Front end web framework
* [Prisma](https://www.prisma.io/) - GraphQL NodeJS backend
