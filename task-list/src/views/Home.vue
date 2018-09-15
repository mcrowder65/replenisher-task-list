<template>
  <div class="home">
    <el-container class="page-container">
      <el-header>
        <nav-bar/>
      </el-header>
      <el-container>
        <el-aside width="275px">
          <nav-menu/>
        </el-aside>
        <el-main>
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import {NavBar, NavMenu} from '@/components/navigation'
export default {
  name: 'home',
  components: {
    'nav-bar': NavBar,
    'nav-menu': NavMenu
  }
}
</script>

<style scoped>
.home {
  margin: 0px;
  height: 100vh;
}
.el-header {
  padding: 0px;
  margin-bottom: 0px;
}
.page-container {
  height: 100%;
}
</style>
