<template>
  <el-dialog
    :visible.sync="value"
    :before-close="() => {$emit('input', false)}"
    :title="header"
    width="40%">
    <el-form>
      <el-form-item label="Title" :error="error">
        <el-input type="text" v-model="noteTitle" autocomplete="off" @focus="clearError"></el-input>
      </el-form-item>
      <el-form-item label="Note" :error="error">
        <el-input type="textarea" v-model="noteText" autocomplete="off" @focus="clearError"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('input', false)">Cancel</el-button>
      <el-button type="primary" @click="confirm">Confirm</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'CreateNoteDialog',
  props: {
    error: {
      type: String,
      required: true
    },
    header: {
      type: String,
      required: false,
      default: 'Add Note'
    },
    title: {
      type: String,
      required: false,
      default: ''
    },
    text: {
      type: String,
      required: false,
      default: ''
    },
    value: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      noteTitle: '',
      noteText: ''
    }
  },
  watch: {
    title () {
      this.noteTitle = this.title
    },
    text () {
      this.noteText = this.text
    }
  },
  methods: {
    clearError () {
      this.$emit('clear-error')
    },
    confirm () {
      this.$emit('confirm', this.noteTitle, this.noteText)
      this.noteTitle = ''
      this.noteText = ''
    }
  }
}
</script>

<style scoped>
</style>