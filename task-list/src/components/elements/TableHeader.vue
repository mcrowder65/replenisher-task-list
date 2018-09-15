<template>
  <div class="table-header">
    {{ text }}
  </div>
</template>

<script>
export default {
  name: 'TableHeader',
  props: {
    text: {
      type: String,
      required: true
    } 
  }
}
</script>

<style scoped>
.table-header {
  margin: 16px 0 16px 0;
  font-size: 18px;
  width: auto;
}
</style>