const { getUserId, isAdmin } = require('../../utils')

const task = {
  async assignTask(parent, args, ctx, info) {
    isAdmin(ctx)
    const tasks = await ctx.db.query.tasks({
      where: {
        taskMeta: {
          id: args.id 
        }
      }
    })
    if (tasks.length > 0) {
      return tasks[0]
    }
    return await ctx.db.mutation.createTask({
      data: {
        assigned: true,
        taskMeta: {
          connect: {
            id: args.id
          }
        },
        user: {
          connect: {
            id: args.userId
          }
        }
      }
    }) 
  },

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