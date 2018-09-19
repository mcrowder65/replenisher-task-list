import test from "ava";
import { GraphQLClient } from "graphql-request";
const url = 'http://localhost:4000'
var faker = require('faker');
import {user} from './seedData'

test.serial("createTask with proper arguments should save it to user", async test => {

})

test.serial("createTask with out all variables should throw an error", async test => {

})

test.serial("updateTask with valid next status should move status forward", async test => {

})

test.serial("updateTask with valid next status should add StatusStat", async test => {

})

test.serial("updateTask with invalid next status should do nothing", async test => {

})

test.serial("tasks should be returned sorted by priority", async test => {

})

test.serial("tasks should be returned sorted by date", async test => {

})