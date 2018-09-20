<template>
  <div>
    <el-menu
      class="nav-bar"
      mode="horizontal">
      <h2 class="title">Replenisher Task List</h2>
      <el-button 
        v-if="showButton"
        class="logout-button" 
        @click="logout">
        Logout <i class="el-icon-circle-close-outline"></i>
      </el-button>
    </el-menu>
  </div>
</template>

<script>
import cookie from 'js-cookie'

export default {
  name: 'NavBar',
  computed: {
    showButton () {
      const token = cookie.get('auth_token')
      if (token) return true
      return false
    }
  },
  methods: {
    logout () {
      // We are storing the auth_token in a cookie so when they logout we need
      // to remove that cookie
      cookie.remove('auth_token')
      this.$router.replace('/login')
    }
  }
}
</script>

<style scoped>
.logout-button {
  float: right;
  margin-right: 32px;
  margin-top: 16px;
}
.nav-bar {
  z-index: 1;
}
.title {
  float: left;
  margin-left: 24px;
}
</style>