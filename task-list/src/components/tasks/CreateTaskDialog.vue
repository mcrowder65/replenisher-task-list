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
        <el-form-item :error="error">
          <div>Priority:</div>
          <el-select v-model="priority" placeholder="Select Option">
            <el-option value="Low">Low</el-option>
            <el-option value="Medium">Medium</el-option>
            <el-option value="High">High</el-option>
          </el-select>
        </el-form-item>
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
      description: ''
    }
  },
  methods: {
    clearError () {
      this.$emit('clear-error')
    },
    createTask () {
      this.$emit('confirm', this.title, this.description, this.priority)
    }
  }
}
</script>