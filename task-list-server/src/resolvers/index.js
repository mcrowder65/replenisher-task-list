const { Query } = require('./Query')
const { auth } = require('./Mutation/auth')
const { task } = require('./Mutation/task')
const { note } = require('./Mutation/note')
const { AuthPayload } = require('./AuthPayload')

module.exports = {
  Query,
  Mutation: {
    ...auth,
    ...note,
    ...task
  },
  AuthPayload,
}
