<template>
  <div class="task-table">
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
          <el-row type="flex" class="info-row">
            Status: 
            <el-progress 
              :text-inside="true" 
              :stroke-width="18" 
              :percentage="70"
              class="progress-bar"
              />
          </el-row>
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
              circle></el-button>
            <el-button type="success" icon="el-icon-check" circle></el-button>
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

const currentUserQuery = gql`
  query currentUser {
    currentUser {
      id
      admin
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
    'create-note-dialog': CreateNoteDialog
  },
  apollo: {
    currentUser: {
      query: currentUserQuery
    }
  },
  data () {
    return {
      activeName: "",
      currentNote: null,
      error: '',
      showNoteDialog: false,
      currentTask: {}
    }
  },
  methods: {
    deleteNote (id) {
      this.$apollo.mutate({
        mutation: deleteNoteMutation,
        variables: {
          id
        }
      })
        .then(({data}) => {
          this.$emit('change')
        })
    },

    createNote (title, text) {
      this.$apollo.mutate({
        mutation: this.currentNote ? updateNoteMutation : createNoteMutation,
        variables: {
          title: title,
          text: text,
          id: this.currentNote ? this.currentNote.id : this.currentTask.id
        }
      })
        .then(({data}) => {
          this.$emit('change')
          this.showNoteDialog = false
          this.error = ''
          this.currentNote = null
        })
        .catch(() => {
          this.error = 'There was an error creating this note'
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
  margin-top: 8px;
}
.note-icon {
  margin-left: 8px;
  margin-right: 8px;
}
.progress-bar {
  margin-left: 16px;
  margin-bottom: 8px;
  width: 300px;
}
.title {
  font-size: 18px;
}
</style>