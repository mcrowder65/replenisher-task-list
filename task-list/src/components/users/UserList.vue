<template>
  <div class="user-list">
    <el-row type="flex">
      <el-col :span="3">
        <table-header text="Current Users"/>
      </el-col>
      <el-col :span="6">
        <search-bar :loading="loading" @search="search"/>
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
            <task-table v-if="user.tasks" :tasks="user.tasks"/>
            <div>No current tasks assigned</div>
          </div>
        </el-collapse-item> 
      </template>
    </el-collapse>
    <action-button @click="showDialog = true"/>

    <el-dialog
      title="Create New User"
      :visible.sync="showDialog"
      width="40%">
      <el-form>
        <el-form-item label="First and Last Name" :error="error">
          <el-input type="text" v-model="name" autocomplete="off" @focus="clearError"></el-input>
        </el-form-item>
        <el-form-item label="Email" :error="error">
          <el-input type="text" v-model="email" autocomplete="off" @focus="clearError"></el-input>
        </el-form-item>
        <el-form-item label="Password" :error="error">
          <el-input type="password" v-model="password" autocomplete="off" @focus="clearError"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">Cancel</el-button>
        <el-button type="primary" @click="confirmNewUser">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { TableHeader, SearchBar, ActionButton } from '@/components/elements'
import { TaskTable } from '@/components/tasks'
import gql from 'graphql-tag'

const usersQuery = gql`
  query users($search: String) {
    users(search: $search) {
      name
      email
      tasks(where: {assigned: true}) {
        id
        taskMeta {
          title
          description
          priority
          beginDate
          endDate
        }
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

const signupMutation = gql`
  mutation signup($name: String!, $email: String!, $password: String!) {
    signup(name: $name, email: $email, password: $password) {
      user {
        id
      }
    }
  }
`

export default {
  name: 'UserList',
  components: {
    'action-button': ActionButton,
    'search-bar': SearchBar,
    'table-header': TableHeader,
    'task-table': TaskTable
  },
  apollo: {
    users: {
      query: usersQuery
    }
  },
  data () {
    return {
      activeName: '',
      name: '',
      email: '',
      error: '',
      loading: false,
      password: '',
      showDialog: false
    }
  },
  methods: {
    clearError () {
      this.error = ''
    },
    confirmNewUser () {
      this.$apollo.mutate({
        mutation: signupMutation,
        variables: {
          name: this.name,
          email: this.email,
          password: this.password
        }
      })
        .then(() => {
          this.showDialog = false
          this.$apollo.queries.users.refetch()
        })
        .catch(() => {
          this.error = 'There was an error creating this user'
        })
    },
    search (text) {
      this.$apollo.queries.users.refetch({
        search: text
      })
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