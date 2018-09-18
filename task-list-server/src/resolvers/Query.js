const { getUserId, isAdmin } = require('../utils')
const { uniq } = require('lodash')
const moment = require('moment')

const priority = ["LOW", "MEDIUM", "HIGH"]
const orderTasks = (tasks) => {
  return tasks.sort((a,b) => {
    priorityA = priority.indexOf(a.taskMeta.priority)
    priorityB = priority.indexOf(b.taskMeta.priority)
    if (priorityA !== priorityB) return priorityA < priorityB

    dateA = (new Date(a.taskMeta.endDate)) - (new Date(a.taskMeta.beginDate))
    dateB = (new Date(b.taskMeta.endDate)) - (new Date(b.taskMeta.beginDate))
    if (dateA !== dateB) return dateA < dateB

    return a.taskMeta.title.localeCompare(b.taskMeta.title)
  })
}

const updateMetaDates = async (meta, db) => {
  if (meta.repeat <= 0) return

  let today = moment()
  let start = moment(meta.beginDate)
  let end = moment(meta.endDate)
  let duration = today.diff(start, 'days')

  if (today.isBetween(start, end)) return // the meta has been updated to current time
  else if (duration > 0) { // duration > 0 means meta date is in past
    let newBeginDate = today.subtract(duration % meta.repeat, 'd').toDate()
    let newEndDate = moment(newBeginDate).add(end.diff(start, 'days'), 'd').toDate()
    await db.mutation.updateTaskMeta({
      data: {
        beginDate: newBeginDate,
        endDate: newEndDate
      },
      where: {
        id: meta.id
      }
    })
    // create a new task for all users who have this task meta
    const users = await db.query.users({
      where: {
        tasks_some: {
          taskMeta: {
            id: meta.id
          }
        }
      }
    })
    const ids = users.map((user) => {return user.id})
    uniq(ids).forEach((id) => {
      db.mutation.createTask({
        data: {
          taskMeta: {
            connect: {
              id: meta.id
            }
          },
          beginDate: newBeginDate,
          endDate: newEndDate, 
          user: {
            connect: {
              id
            }
          }
        }
      }) 
    })
  }
}

const createReocurringTasks = async (userId, db) => {
  const taskMetas = await db.query.taskMetas({
    where: {
      tasks_some: {
        user: {
          id: userId
        }
      }
    }
  })
  taskMetas.forEach(async (meta) => {
    updateMetaDates(meta, db)
  })
}

const Query = {
  async currentUser(parent, args, ctx, info) {
    const id = getUserId(ctx)
    let user = await ctx.db.query.user({ where: { id } }, info)
    if (user.tasks) {
      user.tasks = orderTasks(user.tasks)
      createReocurringTasks(id, ctx.db)
    }
    return user
  },

  async users(parent, args, ctx, info) {
    isAdmin(ctx)
    let users = await ctx.db.query.users({
      where: {
        OR: [
          { email_contains: args.search || '' },
          { name_contains: args.search || ''}
        ]
      },
      orderBy: "name_ASC",
      first: 25
    }, info)
    users.map((user) => {
      if (user.tasks) {
        user.tasks = orderTasks(user.tasks)
        createReocurringTasks(user.id, ctx.db)
      }
      return user
    })
    return users
  },

  async templates(parent, args, ctx, info) {
    isAdmin(ctx)
    const templates = await ctx.db.query.templates({
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
    templates.forEach((template) => {
      updateMetaDates(template.taskMeta, ctx.db)
    })
    return templates
  }
  
}

module.exports = { Query }
