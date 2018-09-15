<template>
  <div class="template-list">
    <el-row type="flex">
      <el-col :span="4">
        <table-header text="Available Templates"/>
      </el-col>
      <el-col :span="6">
        <search-bar/>
      </el-col>
    </el-row>
    <el-collapse v-model="activeName">
      <template v-for="task in tasks">
        <el-collapse-item
          :name="task.id"
          :key="task.id">
          <template slot="title">
              <span class="title">{{ task.title }}</span>
          </template>
          12/30/2018 - 01/01/2019 <br>
          <el-row class="info-row">
            Description: {{ task.description }}
          </el-row>
          <el-row class="button-row">
            <el-button type="primary" class="assign-button">Assign to User</el-button>
          </el-row>
        </el-collapse-item>
      </template>
    </el-collapse>
    <action-button/>
  </div>
</template>

<script>
import { TableHeader, ActionButton, SearchBar } from '@/components/elements'

export default {
  name: 'TemplateList',
  components: {
    'table-header': TableHeader,
    'action-button': ActionButton,
    'search-bar': SearchBar
  },
  data () {
    return {
      activeName: "1",
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
      ],
      search: ''
    }
  }
}
</script>

<style scoped>
.assign-button {
  margin-top: 8px
}
.template-list {
  text-align: left;
}
</style>