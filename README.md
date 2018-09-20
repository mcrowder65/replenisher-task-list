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
run docker-compose up -d # make sure docker daemon is running locally before this step
primsa deploy
```

## Running the application locally

```
cd task-list
yarn install
yarn start

cd ../task-list-server
yarn install
yarn start
```

At this point the server should be running on localhost:4000 and you can access the site by going to [localhost:8080/#/login](localhost:8080/#/login)
The database has been seeded with the admin account email: "admin@dev.com" and password: "nooneknows". Login with these credentials to test out the application.

## Running the tests

The automated tests are run through a package called ava. Scripts have been set up in the package.json for you. The tests start a local server running in the background, if for some reason the tests fail you will need to call the `cleanup-test` or `kill-server` command to stop it running (normally this is taken care of by the `test` command). Make sure the local server isnt running before running tests.

```
yarn test
```

## Other Notes
In this application the tasks that have a repeat set are duplicated as scheduled. Templates with times set in the past will update to the current iteration of the task when assigned to a user. The reoccurring tasks are created when the tasks are queried which means a user would need to sign in to see a task. A cron job (or some event system) in a production environment could be set up to deliever tasks in another way. Status is kept on the task and a StatusStat is created in the model although it isn't being used currently.

## Built With
* [VueJS](https://vuejs.org/) - Front end web framework
* [ElementUI](http://element.eleme.io/#/en-US/component/installation) - Component framework
* [Prisma](https://www.prisma.io/) - GraphQL NodeJS backend
