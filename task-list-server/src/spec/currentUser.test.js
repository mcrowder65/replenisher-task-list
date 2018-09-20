import test from "ava";
import { GraphQLClient } from "graphql-request";
const url = 'http://localhost:4000'
var faker = require('faker');

const name = faker.name.findName()
const email = faker.internet.email()
const password = faker.internet.password()

const query = `
  query {
    currentUser {
      id
    }
  }
`
const loginMutation = `
  mutation {
    login(email: "${email}", password: "${password}") {
      token
    }
  }
`

const signupMutation = `
  mutation {
    signup(name: "${name}", password: "${password}", email: "${email}") {
      token
      user {
        id
      }
    }
  }
`
test.serial("if token is invalid, currentUser should throw an error", async test => {
  try {
    const client = new GraphQLClient(url, {
      headers: {
        Authorization: "123"
      }
    });
    await client.request(query)
    test.fail("it should fail")
  } catch (err) {
    test.pass()
  }
})

test.serial("signup should create a new user and return a valid token", async test => {
  try {
    const client = new GraphQLClient(url)
    let {signup} = await client.request(signupMutation)
    if (signup.token && signup.user.id) {
      const clientWithValidToken = new GraphQLClient(url, {
        headers: {
          Authorization: `Bearer ${signup.token}`
        }
      })
      const {currentUser} = await clientWithValidToken.request(query)
      if (currentUser.id) { // If an id is present then the request succeeded
        test.pass()
      } else {
        test.fail('Couldnt retreive user info')
      }
    } else {
      test.fail('it should have returned a token and user id')
    }
  } catch (err) {
    test.fail(err)
  }
})

test.serial("login should return a valid token", async test => {
  try {
    const client = new GraphQLClient(url)
    const {login} = await client.request(loginMutation)
    const clientWithToken = new GraphQLClient(url, {
      headers: {
        Authorization: `Bearer ${login.token}`
      }
    })
    await clientWithToken.request(query)
    test.pass()
  } catch (err) {
    test.fail(err)
  }
})