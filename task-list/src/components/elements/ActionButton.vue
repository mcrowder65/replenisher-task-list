<template>
  <el-button 
    type="primary" 
    :icon="icon" 
    circle 
    class="new-button"
    @click="$emit('click')"/>
</template>

<script>
export default {
  name: 'ActionButton',
  props: {
    icon: {
      type: String,
      required: false,
      default: "el-icon-plus"
    }
  }
}
</script>

<style scoped>
.new-button {
  position: absolute;
  right:    20px;
  bottom:   20px;
}
</style>