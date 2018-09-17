const { getUserId, isAdmin } = require('../utils')

const Query = {
  currentUser(parent, args, ctx, info) {
    const id = getUserId(ctx)
    return ctx.db.query.user({ where: { id } }, info)
  },

  users(parent, args, ctx, info) {
    isAdmin(ctx)
    return ctx.db.query.users({
      where: {
        OR: [
          { email_contains: args.search || '' },
          { name_contains: args.search || ''}
        ]
      },
      orderBy: "name_ASC",
      first: 25
    },info)
  },

  templates(parent, args, ctx, info) {
    isAdmin(ctx)
    return ctx.db.query.templates({
      where: {
        taskMeta: {
          OR: [
            { title_contains: args.search || ''},
            { description_contains: args.search || ''}
          ]
        }
      },
      orderBy: "id_DESC",
      first: 25
    }, info)
  }
  
}

module.exports = { Query }
