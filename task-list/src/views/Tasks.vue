<template>
  <div>
    <task-list/>
  </div>
</template>

<script>
import { TaskList } from '@/components/tasks'
export default {
  name: 'TaskView',
  components: {
    'task-list': TaskList
  }
}
</script>