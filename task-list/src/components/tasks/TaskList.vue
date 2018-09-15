<template>
  <div class="task-list">
    <table-header text="Tasks to Complete"/>
    <task-table :tasks="tasks"/>
    <action-button/>
  </div>
</template>

<script>
import TaskTable from './TaskTable.vue'
import { TableHeader, ActionButton } from '@/components/elements'

export default {
  name: 'TaskList',
  components: {
    'action-button': ActionButton,
    'table-header': TableHeader,
    'task-table': TaskTable
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
      ]
    }
  }
}
</script>

<style scoped>
.task-list {
  text-align: left;
}
</style>