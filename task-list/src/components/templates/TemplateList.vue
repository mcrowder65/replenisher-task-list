<template>
  <div class="template-list">
    <el-row type="flex">
      <el-col :span="4">
        <table-header text="Available Templates"/>
      </el-col>
      <el-col :span="6">
        <search-bar :loading="loading" @search="search"/>
      </el-col>
    </el-row>
    <el-collapse v-model="activeName">
      <template v-for="template in templates">
        <el-collapse-item
          :name="template.id"
          :key="template.id">
          <template slot="title">
              <span class="title">{{ template.taskMeta.title }}</span>
              <priority-tag :task="template"/>
          </template>
          <el-row class="info-row">
            Description: {{ template.taskMeta.description }}
          </el-row>
          Start Date:
          <el-date-picker
            v-model="template.taskMeta.beginDate"
            type="date"
            readonly
            placeholder="Start Date"/>
          &nbsp;&nbsp; End Date:
          <el-date-picker
            v-model="template.taskMeta.endDate"
            type="date"
            readonly
            placeholder="Start Date"/>
          <el-row class="info-row">
            Repeat: {{ (template.taskMeta.repeat === 0) ? 'No Repeat' : 'Every ' + template.taskMeta.repeat + ' days'}}
          </el-row>
          <el-row class="button-row">
            <el-button type="primary" class="assign-button" @click="showAssignDialog = true; metaId = template.taskMeta.id">Assign to User</el-button>
          </el-row>
        </el-collapse-item>
      </template>
    </el-collapse>
    <action-button
      @click="showNewDialog = true"/>
    
    <create-task-dialog
      v-model="showNewDialog"
      :error="error"
      @confirm="createTemplate"
      @clear-error="error = ''"/>
    
    <el-dialog
      :visible.sync="showAssignDialog"
      title="Assign Task to User"
      width="33%">
      <el-select v-model="userId">
        <template v-for="user in users">
          <el-option :key="user.id" :value="user.id" :label="user.name"/>
        </template>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="$emit('input', false)">Cancel</el-button>
        <el-button type="primary" @click="assignTask">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { TableHeader, ActionButton, SearchBar } from '@/components/elements'
import { CreateTaskDialog, PriorityTag } from '@/components/tasks'
import gql from 'graphql-tag'

const createTemplateMutation = gql`
  mutation createTemplate($title: String!, $description: String!, $priority: Priority!, $repeat: Int!, $beginDate: DateTime!, $endDate: DateTime!) {
    createTemplate(title: $title, description: $description, priority: $priority, repeat: $repeat, beginDate: $beginDate, endDate: $endDate) {
      id
    }
  }
`

const assignTaskMutation = gql`
  mutation assignTask($id: ID!, $userId: ID!){
    assignTask(id: $id, userId: $userId) {
      id
    }
  }
`

const usersQuery = gql`
  query users($search: String) {
    users(search: $search) {
      id
      name
      email
    }
  }
`

const templateQuery = gql`
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

export default {
  name: 'TemplateList',
  components: {
    'create-task-dialog': CreateTaskDialog,
    'table-header': TableHeader, 
    'action-button': ActionButton,
    'search-bar': SearchBar,
    'priority-tag': PriorityTag
  },
  apollo: {
    templates: {
      query: templateQuery
    },
    users: {
      query: usersQuery
    }
  },
  data () {
    return {
      activeName: "1",
      error: '',
      metaId: '',
      userId: '',
      loading: false,
      showNewDialog: false,
      showAssignDialog: false
    }
  },
  methods: {
    assignTask () {
      this.$apollo.mutate({
        mutation: assignTaskMutation,
        variables: {
          id: this.metaId,
          userId: this.userId
        }
      })
        .then(() => {
          this.$apollo.queries.templates.refetch()
          this.showAssignDialog = false
        })
    },
    createTemplate ({title, description, priority, beginDate, endDate, repeat}) {
      this.$apollo.mutate({
        mutation: createTemplateMutation,
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
        this.$apollo.queries.templates.refetch()
        this.showNewDialog = false
        this.error = ''
      })
      .catch(() => {
        this.error = 'There was an error creating this template'
      })
    },
    search (text) {
      this.$apollo.queries.templates.refetch({
        search: text
      })
    }
  }
}
</script>

<style scoped>
.assign-button {
  margin-top: 8px
}
.info-row {
  margin-top: 8px;
  margin-bottom: 8px;
}
.template-list {
  text-align: left;
}
.title {
  font-size: 18px;
}
</style>