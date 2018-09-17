const { getUserId } = require('../../utils')

const task = {
  createTask(parent, args, ctx, info) {
    const id = getUserId(ctx)
    return ctx.db.mutation.createTask({
      data: {
        taskMeta: {
          create: {
            title: args.title,
            description: args.description,
            priority: args.priority,
            repeat: args.repeat,
            beginDate: new Date(args.beginDate),
            endDate: new Date(args.endDate)
          }
        },
        user: {
          connect: {
            id
          }
        }
      }
    })
  },

  updateTask(parent, args, ctx, info) {
    const id = getUserId(ctx)
    return ctx.db.mutation.updateTask({
      where: {
        id: args.id,
      },
      data: {
        status: args.status
      }
    })
  }
}

module.exports = { task }