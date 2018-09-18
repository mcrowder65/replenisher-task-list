const { getUserId, isAdmin } = require('../../utils')

const task = {
  async assignTask(parent, args, ctx, info) {
    isAdmin(ctx)
    const tasks = await ctx.db.query.tasks({
      where: {
        taskMeta: {
          id: args.id 
        },
        user: {
          id: args.userId
        }
      }
    })
    if (tasks.length > 0) {
      return tasks[0]
    }
    const meta = await ctx.db.query.taskMeta({
      where: {
        id: args.id
      }
    })
    return await ctx.db.mutation.createTask({
      data: {
        assigned: true,
        taskMeta: {
          connect: {
            id: args.id
          }
        },
        beginDate: meta.beginDate,
        endDate: meta.endDate,
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
        beginDate: new Date(args.beginDate),
        endDate: new Date(args.endDate),
        user: {
          connect: {
            id
          }
        }
      }
    })
  },

  async updateTask(parent, args, ctx, info) {
    const id = getUserId(ctx)
    let task = ctx.db.query.task({
      where: {
        id: args.id
      }
    }, "{ taskMeta { id }}")
    if (task.status != args.status) {
      ctx.db.mutation.createStatusStat({
        data: {
          status: task.status
        },
        taskMeta: {
          connect: {
            id: task.taskMeta.id
          }
        }
      })
    }
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