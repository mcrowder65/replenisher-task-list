<template>
  <el-menu
    :router="true"
    default-active="tasks"
    class="nav-menu">
    <el-menu-item index="tasks">
      <i class="el-icon-tickets"></i>
      <span>All Tasks</span>
    </el-menu-item>
    <el-menu-item index="tasks?display=assigned">
      <i class="el-icon-date"></i>
      <span>Assigned Tasks</span>
    </el-menu-item>
    <el-menu-item index="tasks?display=personal">
      <i class="el-icon-edit-outline"></i>
      <span>Personal Tasks</span>
    </el-menu-item>
    <el-menu-item index="templates">
      <i class="el-icon-document"></i>
      <span>Task Templates</span>
    </el-menu-item>
    <el-menu-item index="users">
      <i class="el-icon-share"></i>
      <span>Users</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: 'NavMenu'
}
</script>

<style scoped>
.nav-menu {
  height: 100%;
  padding-top: 32px;
  text-align: left;
}
</style>