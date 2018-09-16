const { getUserId, isAdmin } = require('../utils')

const Query = {
  currentUser(parent, args, ctx, info) {
    const id = getUserId(ctx)
    return ctx.db.query.user({ where: { id } }, info)
  },

  async users(parent, args, ctx, info) {
    isAdmin(ctx)
    return await ctx.db.query.users({
      where: {
        OR: [
          { email_contains: args.search || '' },
          { name_contains: args.search || ''}
        ]
      },
      orderBy: "name_ASC",
      first: 25
    })
  }
}

module.exports = { Query }
