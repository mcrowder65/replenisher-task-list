const {GraphQLClient} = require('graphql-request')
const url = 'http://localhost:4000'

const user = {
  email: 'admin@dev.com',
  password: 'nooneknows'
}

const loginMutation = `
  mutation login($email: String!, $password: String!){
    login(email: $email, password: $password) {
      token
    }
  }
`

const signupMutation = `
  mutation signup($email: String!, $password: String!, $name: String!){
    signup(name: $name, password: $password, email: $email) {
      token
      user {
        id
      }
    }
  }
`

const token = async (email, password, name) => {
  let token = ''
  if (!name) { // Login instead of signup
    const {login} = await (new GraphQLClient(url)).request(loginMutation, {
      email: email ? email : user.email,
      password: password ? password : user.password
    })
    token = login.token
  } else if(email && password){
    const {signup} = await (new GraphQLClient(url)).request(signupMutation, {
      name: name,
      email: email,
      password: password
    })
    token = signup.token
  }
  return token 
}


// This function will create a gql client that has a valid authentication
// token. If no parameters are passed in it will use the default user seeded in the 
// test database. If an email and password and no name is passed it will login with those
// parameters. If a name is passed it will attempt to create a new user.
const graphqlClient = async (email, password, name) => {
  return new GraphQLClient(url, {
    headers: {
      Authorization: `Bearer ${await token(email, password, name)}`
    }
  })
}

module.exports =  {
  graphqlClient
}