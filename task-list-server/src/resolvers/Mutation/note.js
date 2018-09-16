const { getUserId, isAdmin } = require('../../utils')

const note = {
  createNote(parent, args, ctx, info) {
    const id = getUserId(ctx)
    return ctx.db.mutation.createNote({
      data: {
        title: args.title,
        text: args.text,
        date: new Date(),
        task: {
          connect: {
            id: args.id
          }
        },
        author: {
          connect: {
            id
          }
        }
      }
    })
  },

  updateNote(parent, args, ctx, info) {
    const id = getUserId(ctx)
    return ctx.db.mutation.updateNote({
      where: {
        id: args.id,
      },
      data: {
        title: args.title,
        text: args.text
      }
    })
  },

  deleteNote(parent, args, ctx, info) {
    isAdmin(ctx)
    return ctx.db.mutation.deleteNote({
      where: {
        id: args.id
      }
    })
  }
}

module.exports = { note }