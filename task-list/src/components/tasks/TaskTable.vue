<template>
  <div class="task-table">
    <el-collapse v-model="activeName">
      <template v-for="task in tasks">
        <el-collapse-item
          :name="task.id"
          :key="task.id">
          <template slot="title">
              <span class="title">{{ task.taskMeta.title }}</span>
              <priority-tag :task="task"/>
          </template>
          <el-row class="info-row">
            Description: {{ task.taskMeta.description }}
          </el-row>
          Start Date:
          <el-date-picker
            v-model="task.taskMeta.beginDate"
            type="date"
            readonly
            placeholder="Start Date"/>
          &nbsp;&nbsp; End Date:
          <el-date-picker
            v-model="task.taskMeta.endDate"
            type="date"
            readonly
            placeholder="Start Date"/>
          <el-row type="flex" class="info-row">
            Status: 
            <el-steps :active="status.indexOf(task.status)" class="progress-bar" finish-status="success">
              <el-step title="Ready for Work"></el-step>
              <el-step title="In Progress"></el-step>
              <el-step title="Finished" :status="task.status === 'FINISHED' ? 'success' : ''"></el-step>
            </el-steps>
          </el-row>
          Notes:
          <el-table
            v-if="task.notes && task.notes.length > 0"
            :expand-row-keys="[task.notes[0].id]"
            :row-key="(item) => {return item.id}"
            :data="task.notes"
            style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="props">
                <i class="el-icon-message note-icon"></i> {{ props.row.text }}
              </template>
            </el-table-column>
            <el-table-column
              label="Date"
              width="200">
              <template slot-scope="scope">
                <i class="el-icon-time"></i>
                <span style="margin-left: 10px">{{ new Date(scope.row.date).toDateString() }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="Title"
              width="300">
              <template slot-scope="scope">
                <span>{{ scope.row.title }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="Author"
              width="300">
              <template slot-scope="scope">
                <span>{{ scope.row.author.name }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="Options">
              <template slot-scope="scope">
                <el-button
                  v-if="currentUser && currentUser.id === scope.row.author.id"
                  size="mini"
                  @click="currentNote=scope.row;showNoteDialog = true">Edit</el-button>
                <el-button
                  v-if="currentUser && currentUser.admin"
                  size="mini"
                  type="danger"
                  @click="deleteNote(scope.row.id)">Delete</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-row class="button-row">
            <el-button icon="el-icon-edit" circle @click="currentTask = task; showNoteDialog=true;"></el-button>
            <el-button
              type="primary"
              icon="el-icon-caret-right"
              circle
              @click.native="updateStatus(task)"/>
            <!-- <el-button type="success" icon="el-icon-check" circle></el-button> -->
          </el-row>
        </el-collapse-item>
      </template>
    </el-collapse>

    <create-note-dialog
      v-model="showNoteDialog"
      :error="error"
      :header="currentNote ? 'Edit Note' : 'Add Note'"
      :title="currentNote ? currentNote.title : ''"
      :text="currentNote ? currentNote.text : ''"
      @confirm="createNote"
      @clear-error="error = ''"
    />
  </div>
</template>

<script>
import gql from 'graphql-tag'
import CreateNoteDialog from './CreateNoteDialog.vue'
import PriorityTag from './PriorityTag.vue'

const currentUserQuery = gql`
  query currentUser {
    currentUser {
      id
      admin
    }
  }
`

const updateTaskMutation = gql`
  mutation updateTask($id: ID!, $status: Status) {
    updateTask(id: $id, status: $status) {
      id
    }
  }
`
const deleteNoteMutation = gql`
  mutation deleteNote($id: ID!) {
    deleteNote(id: $id) {
      id
    }
  }
`
const createNoteMutation = gql`
  mutation createNote($title: String!, $text: String!, $id: ID!) {
    createNote(title: $title, text: $text, id: $id) {
      id
    }
  }
`

const updateNoteMutation = gql`
  mutation updateNote($title: String!, $text: String!, $id: ID!) {
    updateNote(title: $title, text: $text, id: $id) {
      id
    }
  }
`

export default {
  name: 'TaskTable',
  props: {
    tasks: {
      type: Array,
      required:true
    }
  },
  components: {
    'create-note-dialog': CreateNoteDialog,
    'priority-tag': PriorityTag
  },
  apollo: {
    currentUser: {
      query: currentUserQuery
    }
  },
  data () {
    return {
      activeName: "",
      status: ['READY', 'STARTED', 'FINISHED'],
      currentNote: null,
      error: '',
      showNoteDialog: false,
      currentTask: {}
    }
  },
  methods: {
    createNote (title, text) {
      this.$apollo.mutate({
        mutation: this.currentNote ? updateNoteMutation : createNoteMutation,
        variables: {
          title: title,
          text: text,
          id: this.currentNote ? this.currentNote.id : this.currentTask.id
        }
      })
        .then(() => {
          this.$emit('change')
          this.showNoteDialog = false
          this.error = ''
          this.currentNote = null
        })
        .catch(() => {
          this.error = 'There was an error creating this note'
        })
    },
    
    deleteNote (id) {
      this.$apollo.mutate({
        mutation: deleteNoteMutation,
        variables: {
          id
        }
      })
        .then(() => {
          this.$emit('change')
        })
    },

    updateStatus ({id, status}) {
      let index = this.status.indexOf(status)
      if (index === this.status.length - 1) return
      this.$apollo.mutate({
        mutation: updateTaskMutation,
        variables: {
          id,
          status: this.status[(index + 1)]
        }
      })
        .then(() => {
          this.$emit('change')
        })
    }
  }
}
</script>

<style scoped>
.button-row {
  margin: 16px 0 0 8px;
}
.info-row {
  margin-top: 10px;
  margin-bottom: 10px;
}
.note-icon {
  margin-left: 8px;
  margin-right: 8px;
}
.progress-bar {
  margin-left: 16px;
  margin-bottom: 8px;
  width: 400px;
}
.title {
  font-size: 18px;
}
</style>