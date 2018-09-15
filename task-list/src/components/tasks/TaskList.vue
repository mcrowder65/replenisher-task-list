<template>
  <div class="task-list">
    <div class="table-header">
      Tasks to Complete: 
    </div>
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
              width="180">
              <template slot-scope="scope">
                <i class="el-icon-time"></i>
                <span style="margin-left: 10px">{{ scope.row.date }}</span>
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
              label="Operations">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  disabled
                  @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-row class="button-row">
            <el-button icon="el-icon-edit" circle></el-button>
            <el-button type="primary" icon="el-icon-caret-right" circle></el-button>
            <el-button type="success" icon="el-icon-check" circle></el-button>
          </el-row>
        </el-collapse-item>
      </template>
    </el-collapse>
    <el-button type="primary" icon="el-icon-edit" circle class="new-button"></el-button>
  </div>
</template>

<script>
export default {
  name: 'TaskList',
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
.button-row {
  margin: 16px 0 0 8px;
}
.info-row {
  margin-top: 8px;
}
.new-button {
  position: absolute;
  right:    20px;
  bottom:   20px;
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
.task-list {
  text-align: left;
}
.table-header {
  margin: 16px 0 16px 0;
  font-size: 18px;
}
.title {
  font-size: 18px;
}
</style>