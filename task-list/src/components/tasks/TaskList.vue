<template>
  <div class="task-list">
    <table-header text="Tasks to Complete"/>
    <task-table 
      class="task-table"
      v-if="currentUser && currentUser.tasks && currentUser.tasks.length > 0" 
      :tasks="currentUser.tasks"
      @change="$apollo.queries.currentUser.refetch()"/>
    <div v-else>
      You current don't have any tasks to complete
    </div>
    <action-button
      v-if="!($route.query.display === 'assigned')"
      @click="showNewDialog = true"/>
    
    <create-task-dialog
      v-model="showNewDialog"
      :error="error"
      @confirm="createTask"
      @clear-error="error = ''"/>
  </div>
</template>

<script>
import TaskTable from './TaskTable.vue'
import CreateTaskDialog from './CreateTaskDialog.vue'
import { TableHeader, ActionButton } from '@/components/elements'
import gql from 'graphql-tag'

const currentUserQuery = gql`
  query currentUser($assigned: Boolean) {
    currentUser {
      id
      tasks(where: {assigned: $assigned, status_not: FINISHED}) {
        id
        taskMeta {
          title
          description
          priority
        }
        beginDate
        endDate
        status
        notes {
          id
          date
          title
          text
          author {
            id
            name
          }
        }
      }
    }
  }
`

const createTaskMutation = gql`
  mutation createTask($title: String!, $description: String!, $priority: Priority!, $repeat: Int!, $beginDate: DateTime!, $endDate: DateTime!) {
    createTask(title: $title, description: $description, priority: $priority, repeat: $repeat, beginDate: $beginDate, endDate: $endDate) {
      id
    }
  }
`

export default {
  name: 'TaskList',
  components: {
    'action-button': ActionButton,
    'create-task-dialog': CreateTaskDialog,
    'table-header': TableHeader,
    'task-table': TaskTable
  },
  apollo: {
    currentUser: {
      query: currentUserQuery,
      variables () {
        let options = {}
        if (this.$route.query.display) {
          options.assigned = this.$route.query.display === 'assigned'
        }
        return {
          ...options 
        }
      }
    }
  },
  data () {
    return {
      activeName: "",
      error: '',
      showNewDialog: false
    }
  },
  methods: {
    createTask ({title, description, priority, beginDate, endDate, repeat}) {
      this.$apollo.mutate({
        mutation: createTaskMutation,
        variables: {
          title,
          description,
          priority: priority.toUpperCase(),
          beginDate,
          endDate,
          repeat
        }
      })
        .then(() => {
          this.$apollo.queries.currentUser.refetch()
          this.showNewDialog = false
          this.error = ''
        })
        .catch(() => {
          this.error = 'There was an error creating this task'
        })
    }
  }
}
</script>

<style scoped>
.task-list {
  text-align: left;
}
.task-table {
  margin-left: 16px;
}
</style>