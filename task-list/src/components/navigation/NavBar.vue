<template>
  <div>
    <el-menu
      class="nav-bar"
      mode="horizontal">
      <h2 class="title">Replenisher Task List</h2>
      <el-menu-item/>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'NavBar'
}
</script>

<style scoped>
.nav-bar {
  z-index: 1;
}
.title {
  float: left;
  margin-left: 24px;
}
</style>