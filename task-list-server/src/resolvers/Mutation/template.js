const { isAdmin } = require('../../utils')

const template  = {
  createTemplate(parent, args, ctx, info) {
    isAdmin(ctx)
    return ctx.db.mutation.createTemplate({
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
        }
      }
    }, info)
  }

}

module.exports = { template }