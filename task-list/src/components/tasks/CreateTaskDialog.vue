<template>
    <el-dialog
      :visible.sync="value"
      :before-close="() => {$emit('input', false)}"
      title="Create New Task"
      width="40%">
      <el-form>
        <el-form-item label="Title" :error="error">
          <el-input type="text" v-model="title" autocomplete="off" @focus="clearError"></el-input>
        </el-form-item>
        <el-form-item label="Description" :error="error">
          <el-input type="textarea" v-model="description" autocomplete="off" @focus="clearError"></el-input>
        </el-form-item>
        <el-row class="date-row">
          <el-col :span="12">
            <div>Start Date</div>
            <el-date-picker
              v-model="beginDate"
              type="date"
              placeholder="Start Date"/>
          </el-col>
          <el-col :span="12">
            <div>End Date</div>
            <el-date-picker
              v-model="endDate"
              type="date"
              placeholder="End Date"/>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <div>Priority</div>
            <el-select v-model="priority" placeholder="Select Option">
              <el-option value="Low">Low</el-option>
              <el-option value="Medium">Medium</el-option>
              <el-option value="High">High</el-option>
            </el-select>
          </el-col>
          <el-col :span="8">
            <div>Repeat Every x Days</div>
            <el-input
              v-model="repeat"
              type="number"
              placeholder="End Date"/>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="$emit('input', false)">Cancel</el-button>
        <el-button type="primary" @click="createTask">Confirm</el-button>
      </span>
    </el-dialog>
</template>

<script>
export default {
  name: 'CreateTaskDialog',
  props: {
    error: {
      type: String,
      required: true
    },
    value: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      title: '',
      priority: '',
      beginDate: new Date(),
      endDate: new Date(),
      repeat: 0,
      description: ''
    }
  },
  methods: {
    clearError () {
      this.$emit('clear-error')
    },
    createTask () {
      this.$emit('confirm', {
        title: this.title,
        description: this.description, 
        beginDate: this.beginDate,
        endDate: this.endDate,
        repeat: this.repeat,
        priority: this.priority
      })
    }
  }
}
</script>

<style scoped>
.date-row {
  margin-bottom: 24px;
}
</style>