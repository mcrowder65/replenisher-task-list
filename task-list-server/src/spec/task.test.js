import test from "ava"
var faker = require('faker');
import {graphqlClient} from './testUtil'
const moment = require('moment')

const taskFragment = `
  id
  beginDate
  endDate
  taskMeta {
    id
    title
    description
    beginDate
    endDate
    priority
  }
  status
`

const createTaskMutation =`
  mutation createTask($title: String!, $description: String!, $priority: Priority!, $repeat: Int!, $beginDate: DateTime!, $endDate: DateTime!) {
    createTask(title: $title, description: $description, priority: $priority, repeat: $repeat, beginDate: $beginDate, endDate: $endDate) {
      ${taskFragment}
    }
  }
`

const updateTaskMutation = `
  mutation updateTask($id: ID!, $status: Status) {
    updateTask(id: $id, status: $status) {
      id
      status
    }
  }
`

const currentUserQuery = `
  query {
    currentUser {
      tasks {
      ${taskFragment}
      }
    }
  }
`

let taskId = ''
test.serial("createTask with required arguments should save it to user", async test => {
  try {
    const title = faker.random.words()
    const description = faker.random.words()
    const beginDate = new Date(faker.date.past())
    const endDate = new Date(faker.date.future())
    const repeat = 0
    const priority = "LOW"
    let client = await graphqlClient()
    let {createTask} = await client.request(createTaskMutation, {
      title,
      description,
      beginDate,
      endDate,
      priority,
      repeat
    })
    taskId = createTask.id
    test.is(createTask.taskMeta.title, title)
    test.is(createTask.taskMeta.description, description)
    test.is(createTask.taskMeta.priority, "LOW")
    test.is(new Date(createTask.beginDate).toDateString(), beginDate.toDateString())
    test.is(new Date(createTask.taskMeta.beginDate).toDateString(), beginDate.toDateString())
    test.is(new Date(createTask.taskMeta.endDate).toDateString(), endDate.toDateString())
    test.is(new Date(createTask.endDate).toDateString(), endDate.toDateString())
    test.pass()
  } catch (err) {
    test.fail(err)
  }
})

test.serial("createTask with out all variables should throw an error", async test => {
  try {
    const title = faker.random.words()
    const repeat = 0
    const priority = "LOW"
    let client = await graphqlClient()
    await client.request(createTaskMutation, {
      title,
      priority,
      repeat
    })
    test.err('it should erro')
  } catch (err) {
    test.pass()
  }
})

test.serial("updateTask with valid next status should move status forward", async test => {
  try {
    let client = await graphqlClient() 
    let result = await client.request(updateTaskMutation, {
      id: taskId
    })
    test.is(result.updateTask.status, "READY")
    let {updateTask} = await client.request(updateTaskMutation, {
      id: taskId,
      status: "STARTED"
    })
    test.is(updateTask.status, "STARTED")
    test.pass()
  } catch (err) {
    test.fail(err)
  }
})

// test.serial("updateTask with valid next status should add StatusStat", async test => {

// })

test.serial("updateTask with invalid next status should return an error", async test => {
  try {
    let client = await graphqlClient() 
    let result = await client.request(updateTaskMutation, {
      id: taskId
    })
    test.is(result.updateTask.status, "STARTED")
    let {updateTask} = await client.request(updateTaskMutation, {
      id: taskId,
      status: "DNE"
    })
    test.fail('It should return an error')
  } catch (err) {
    test.pass()
  }
})

test.serial("tasks should be returned sorted by priority", async test => {
  try {
    const name = faker.name.firstName()
    const email = faker.internet.email()
    const password = faker.internet.password()
    const title = faker.random.words()
    const description = faker.random.words()
    const beginDate = new Date(faker.date.past())
    const endDate = new Date(faker.date.future())
    const repeat = 0
    let client = await graphqlClient(email, password, name)
    await client.request(createTaskMutation, {
      title,
      description,
      beginDate,
      endDate,
      priority: "LOW",
      repeat
    })
    await client.request(createTaskMutation, {
      title,
      description,
      beginDate,
      endDate,
      priority: "MEDIUM",
      repeat
    })
    await client.request(createTaskMutation, {
      title,
      description,
      beginDate,
      endDate,
      priority: "HIGH",
      repeat
    })
    let {currentUser} = await client.request(currentUserQuery)
    const tasks = currentUser.tasks
    test.is(tasks[0].taskMeta.priority, "HIGH")
    test.is(tasks[1].taskMeta.priority, "MEDIUM")
    test.is(tasks[2].taskMeta.priority, "LOW")
    test.pass()
  } catch (err) {
    test.fail(err)
  }
})

test.serial("tasks should be returned sorted by date", async test => {
  try {
    const name = faker.name.firstName()
    const email = faker.internet.email()
    const password = faker.internet.password()
    const title = faker.random.words()
    const description = faker.random.words()
    const priority = "HIGH"
    const repeat = 0
    let client = await graphqlClient(email, password, name)
    const second = await client.request(createTaskMutation, {
      title,
      description,
      beginDate: moment().subtract(10, 'days').toDate(),
      endDate: moment().add(2, 'days').toDate(),
      priority,
      repeat
    })
    const third = await client.request(createTaskMutation, {
      title,
      description,
      beginDate: moment().subtract(10, 'days').toDate(),
      endDate: moment().add(4, 'days').toDate(),
      priority,
      repeat
    })
    const fourth = await client.request(createTaskMutation, {
      title,
      description,
      beginDate: moment().subtract(10, 'days').toDate(),
      endDate: moment().add(6, 'days').toDate(),
      priority,
      repeat
    })
    let first = await client.request(createTaskMutation, {
      title,
      description,
      beginDate: moment().subtract(10, 'days').toDate(),
      endDate: moment().subtract(2, 'days').toDate(),
      priority,
      repeat
    })
    let {currentUser} = await client.request(currentUserQuery)
    const tasks = currentUser.tasks
    test.is(tasks[0].id, first.createTask.id)
    test.is(tasks[1].id, second.createTask.id)
    test.is(tasks[2].id, third.createTask.id)
    test.is(tasks[3].id, fourth.createTask.id)
    test.pass()
  } catch (err) {
    test.fail(err)
  }
})

test.serial("tasks should be returned sorted by priority first then date", async test => {
  try {
    const name = faker.name.firstName()
    const email = faker.internet.email()
    const password = faker.internet.password()
    const title = faker.random.words()
    const description = faker.random.words()
    const priority = "HIGH"
    const repeat = 0
    let client = await graphqlClient(email, password, name)
    const fourth = await client.request(createTaskMutation, {
      title,
      description,
      beginDate: moment().subtract(10, 'days').toDate(),
      endDate: moment().add(2, 'days').toDate(),
      priority: "LOW",
      repeat
    })
    const second = await client.request(createTaskMutation, {
      title,
      description,
      beginDate: moment().subtract(10, 'days').toDate(),
      endDate: moment().add(4, 'days').toDate(),
      priority: "MEDIUM",
      repeat
    })
    const first = await client.request(createTaskMutation, {
      title,
      description,
      beginDate: moment().subtract(10, 'days').toDate(),
      endDate: moment().add(6, 'days').toDate(),
      priority: "HIGH",
      repeat
    })
    let third = await client.request(createTaskMutation, {
      title,
      description,
      beginDate: moment().subtract(10, 'days').toDate(),
      endDate: moment().subtract(2, 'days').toDate(),
      priority: "LOW",
      repeat
    })
    let {currentUser} = await client.request(currentUserQuery)
    const tasks = currentUser.tasks
    test.is(tasks[0].id, first.createTask.id)
    test.is(tasks[1].id, second.createTask.id)
    test.is(tasks[2].id, third.createTask.id)
    test.is(tasks[3].id, fourth.createTask.id)
    test.pass()
  } catch (err) {
    test.fail(err)
  }
})