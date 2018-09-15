<template>
  <div class="user-list">
    <el-row type="flex">
      <el-col :span="3">
        <table-header text="Current Users"/>
      </el-col>
      <el-col :span="6">
        <search-bar/>
      </el-col>
    </el-row>
    <el-collapse v-model="activeName">
      <template v-for="user in users">
        <el-collapse-item
          :name="user.id"
          :key="user.id">
          <template slot="title">
            <span class="title">{{ user.name }} - {{ user.email}}</span>
          </template>
          <div class="sub-title">Assigned Tasks:</div>
          <div class="user-tasks">
            <task-table :tasks="user.tasks"/>
          </div>
        </el-collapse-item> 
      </template>
    </el-collapse>
    <action-button/>
  </div>
</template>

<script>
import { TableHeader, SearchBar, ActionButton } from '@/components/elements'
import { TaskTable } from '@/components/tasks'

export default {
  name: 'UserList',
  components: {
    'action-button': ActionButton,
    'search-bar': SearchBar,
    'table-header': TableHeader,
    'task-table': TaskTable
  },
  data () {
    return {
      activeName: '',
      users: [
        {
          id: '1',
          name: 'Kaden Barlow',
          email: 'kadenbarlow@gmail.com',
          tasks: [
            {
              id: "1",
              title: 'Task #1 ',
              description: 'This is a long description but it would fit here for the task......',
              notes: [
                {
                  id: "145",
                  date: '2016-05-03',
                  title: 'Status Update',
                  text: 'This is a status update, a real status update would be longer but for now oh well...'
                },
                {
                  id: "156",
                  date: '2016-05-03',
                  title: 'Feedback from supervisor',
                  text: 'Here is feedback from supervisor'
                }
              ]
            },
            {
              id: "2",
              title: 'Task #2',
              description: 'This is a long description but it would fit here for the task......'
            },
            {
              id: "3",
              title: 'Task #3',
              description: 'This is a long description but it would fit here for the task......'
            }
          ]
        }
      ]
    }
  }
}
</script>

<style scoped>
.user-list {
  text-align: left;
}
.user-tasks {
  margin-left: 32px;
}
.title {
  font-size: 14px
}
.sub-title {
  font-size: 14px;
  margin-bottom: 16px;
  margin-left: 8px;
}
</style>