import test from "ava"
import {graphqlClient} from './testUtil'

let faker = require('faker')
let moment = require('moment')

const metaFragment = `
  id
  title
  description
  beginDate
  endDate
  priority
  repeat
`

const taskFragment = `
  id
  beginDate
  endDate
  taskMeta {
    ${metaFragment}
  }
  status
`

const createTemplateMutation = `
  mutation createTemplate($title: String!, $description: String!, $priority: Priority!, $repeat: Int!, $beginDate: DateTime!, $endDate: DateTime!) {
    createTemplate(title: $title, description: $description, priority: $priority, repeat: $repeat, beginDate: $beginDate, endDate: $endDate) {
      id
      taskMeta {
        ${metaFragment} 
      }
    }
  }
`

const assignTaskMutation = `
  mutation assignTask($id: ID!, $userId: ID!){
    assignTask(id: $id, userId: $userId) {
      id
      beginDate
      endDate
      taskMeta {
        ${metaFragment}
      }
    }
  }
`
const currentUserQuery = `
  query {
    currentUser {
      id
      tasks {
        ${taskFragment}
      }
    }
  }
`
const templateQuery = `
  query templates($search: String) {
    templates(search: $search) {
      id
      taskMeta {
        id
        title
        description
        priority
        beginDate
        endDate
        repeat
      }
    }
  }
`
test.serial("createTemplate with right params should create the template and task meta", async test => {
  try {
    const title = faker.random.words()
    const description = faker.random.words()
    const beginDate = new Date(faker.date.past())
    const endDate = new Date(faker.date.future())
    const repeat = 0
    const priority = "LOW"
    let client = await graphqlClient()
    let {createTemplate} = await client.request(createTemplateMutation, {
      title,
      description,
      beginDate,
      endDate,
      priority,
      repeat
    })
    test.is(createTemplate.taskMeta.title, title)
    test.is(createTemplate.taskMeta.description, description)
    test.is(createTemplate.taskMeta.priority, "LOW")
    test.is(new Date(createTemplate.taskMeta.beginDate).toDateString(), beginDate.toDateString())
    test.is(new Date(createTemplate.taskMeta.endDate).toDateString(), endDate.toDateString())
    test.pass()
  } catch (err) {
    test.fail(err)
  }
})

test.serial("createTemplate with out right params should through an error", async test => {
  try {
    const description = faker.random.words()
    const endDate = new Date(faker.date.future())
    const repeat = 0
    const priority = "LOW"
    let client = await graphqlClient()
    await client.request(createTemplateMutation, {
      description,
      endDate,
      priority,
      repeat
    })
    test.fail('it should throw an error')
  } catch (err) {
    test.pass()
  }
})

test.serial("assignTask should give task to user", async test => {
  try {
    const title = faker.random.words()
    const description = faker.random.words()
    const beginDate = new Date(faker.date.past())
    const endDate = new Date(faker.date.future())
    const repeat = 0
    const priority = "LOW"
    let client = await graphqlClient()
    let {createTemplate} = await client.request(createTemplateMutation, {
      title,
      description,
      beginDate,
      endDate,
      priority,
      repeat
    })
    const {currentUser} = await client.request(currentUserQuery)
    const {assignTask} = await client.request(assignTaskMutation, {
      userId: currentUser.id,
      id: createTemplate.taskMeta.id
    })
    // Should be linked to the same task meta with info
    test.is(assignTask.taskMeta.id, createTemplate.taskMeta.id) 
    test.is(assignTask.beginDate, createTemplate.taskMeta.beginDate)
    test.is(assignTask.endDate, createTemplate.taskMeta.endDate)
    test.pass()
  } catch (err) {
    test.fail(err)
  }
})

test.serial("assignTask should give task to user no more than once", async test => {
  try {
    const name = faker.name.firstName()
    const email = faker.internet.email()
    const password = faker.internet.password()
    const title = faker.random.words()
    const description = faker.random.words()
    const beginDate = new Date(faker.date.past())
    const endDate = new Date(faker.date.future())
    const repeat = 0
    const priority = "LOW"
    let client = await graphqlClient(email, password, name)
    let {createTemplate} = await client.request(createTemplateMutation, {
      title,
      description,
      beginDate,
      endDate,
      priority,
      repeat
    })
    const {currentUser} = await client.request(currentUserQuery)
    await client.request(assignTaskMutation, {
      userId: currentUser.id,
      id: createTemplate.taskMeta.id
    })
    // Try to assign the task again to the same user
    await client.request(assignTaskMutation, {
      userId: currentUser.id,
      id: createTemplate.taskMeta.id
    })
    const result = await client.request(currentUserQuery)
    test.is(result.currentUser.tasks.length, 1)
    test.pass()
  } catch (err) {
    test.fail(err)
  }
})

test.serial("template time should be updated to most recent reocurrance when queried after initial create", async test => {
  try {
    const title = faker.random.words()
    const description = faker.random.words()
    const date = moment(faker.date.past())
    const repeat = 2
    const priority = "LOW"
    let client = await graphqlClient()
    let {createTemplate} = await client.request(createTemplateMutation, {
      title,
      description,
      beginDate: date.toDate(),
      endDate: date.add(2, 'days').toDate(),
      priority,
      repeat
    })
    await client.request(templateQuery) // kick off reschedudling
    sleep(600) // wait for rescheduling
    const {templates} = await client.request(templateQuery)
    let template = templates.find((template) => {return template.id === createTemplate.id})
    // date because of the add function is now the end date
    test.is((new Date(template.taskMeta.endDate)).toDateString() === date.toDate().toDateString(), false)
    test.pass()
  } catch (err) {
    test.fail(err)
  }
})

test.serial("template time should be rescheduled correctly", async test => {
  try {
    const title = faker.random.words()
    const description = faker.random.words()
    const beginDate = moment().subtract(3, 'days')
    const repeat = 3
    const priority = "LOW"
    let client = await graphqlClient()
    let {createTemplate} = await client.request(createTemplateMutation, {
      title,
      description,
      beginDate: beginDate.toDate(),
      endDate: beginDate.add(1, 'days').toDate(),
      priority,
      repeat
    })
    await client.request(templateQuery) // kick off the rescheduling
    sleep(600) // wait for 600 ms
    const {templates} = await client.request(templateQuery)
    let template = templates.find((template) => {return template.id === createTemplate.id})
    test.is((new Date(template.taskMeta.beginDate)).toDateString(), moment().toDate().toDateString())
    test.pass()
  } catch (err) {
    test.fail(err)
  }
})

// sleep function for async processing I know this is dumb but not sure how to teset
// when it has to be done in background
async function init(){
  await sleep(1000)
}

function sleep(ms){
  return new Promise(resolve=>{
      setTimeout(resolve,ms)
  })
}