const { getUserId, isAdmin } = require('../utils')
const { uniq } = require('lodash')
const moment = require('moment')

const priority = ["LOW", "MEDIUM", "HIGH"]
const orderTasks = (tasks) => {
  return tasks.sort((a,b) => {
    let priorityA = priority.indexOf(a.taskMeta.priority)
    let priorityB = priority.indexOf(b.taskMeta.priority)
    // First sort by priority
    if (priorityA !== priorityB) return priorityA < priorityB

    let startA = moment(a.beginDate)
    let endA = moment(a.endDate)
    let startB = moment(b.beginDate)
    let endB = moment(b.endDate)

    // if priority is the same then sort by the task with the next (or past) due date
    let today = moment()
    let dueA = today.diff(endA, 'days')
    let dueB = today.diff(endB, 'days')

    // Otherwise sort by the titles of the tasks
    if (dueA !== dueB) return dueA < dueB
    return a.taskMeta.title.localeCompare(b.taskMeta.title)
  })
}

const updateMetaDates = async (meta, db) => {
  if (meta.repeat <= 0) return // Then the task never needs to be rescheduled

  let today = moment()
  let start = moment(meta.beginDate)
  let end = moment(meta.endDate)
  let duration = today.diff(start, 'days') // How long ago the task started

  if (today.isBetween(start, end)) return // the meta has been updated to current time
  else if (duration > 0) { // duration > 0 means meta date is in past
    let newBeginDate = today.subtract(duration % meta.repeat, 'd').toDate()
    if (start.diff(moment(newBeginDate), 'days') == 0) return
    let newEndDate = moment(newBeginDate).add(end.diff(start, 'days'), 'd').toDate()
    await db.mutation.updateTaskMeta({ // update the template to have the new occurance times
      data: {
        beginDate: newBeginDate,
        endDate: newEndDate
      },
      where: {
        id: meta.id
      }
    })
    // create a new task for all users who have this task meta
    // first query the users who also have this task
    const users = await db.query.users({
      where: {
        tasks_some: {
          taskMeta: {
            id: meta.id
          }
        }
      }
    })
    // Grab all the ids from users found in query
    const ids = users.map((user) => {return user.id}) 
    uniq(ids).forEach((id) => {
      db.mutation.createTask({
        data: {
          taskMeta: {
            connect: {
              id: meta.id
            }
          },
          assigned: meta.template !== null, // if there is a template then it was assigned
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
    await updateMetaDates(meta, db)
  })
}

const Query = {
  async currentUser(parent, args, ctx, info) {
    const id = getUserId(ctx)
    let user = await ctx.db.query.user({ where: { id } }, info)
    if (user.tasks) {
      user.tasks = orderTasks(user.tasks)
      createReocurringTasks(id, ctx.db) // check to see if any tasks need to reoccur
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
    let query = {
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
    }
    const templates = await ctx.db.query.templates(query,info)
    templates.forEach((template) => {
      updateMetaDates(template.taskMeta, ctx.db) // Update the dates (and tasks) for current templates queried if needed
    })
    return templates
  }
  
}

module.exports = { Query }
