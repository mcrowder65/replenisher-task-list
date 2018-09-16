const { getUserId } = require('../../utils')

const task = {
  createTask(parent, args, ctx, info) {
    const id = getUserId(ctx)
    return ctx.db.mutation.createTask({
      data: {
        ...args,
        user: {
          connect: {
            id
          }
        }
      }
    })
  }
}

module.exports = { task }