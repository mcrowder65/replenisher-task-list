<template>
    <el-tag v-if="task.taskMeta.priority === 'LOW'" type="success" class="tag">Low</el-tag>
    <el-tag v-else-if="task.taskMeta.priority === 'MEDIUM'" type="warning" class="tag">Medium</el-tag>
    <el-tag v-else type="danger" class="tag">High</el-tag>
</template>

<script>
export default {
  name: 'PriorityTag',
  props: {
    task: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.tag {
  margin-left: 16px;
}
</style>
