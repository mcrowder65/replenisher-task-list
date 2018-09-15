<template>
  <div class="login">
    <el-container class="page-container">
      <el-header>
        <nav-bar/>
      </el-header>
      <el-main>
        <el-row>
          <el-col :span="8" :offset="8">
            <el-card class="login-card">
              <div slot="header" class="clearfix">
                <span>Welcome!</span>
              </div>
              <el-form label-width="120px">
                <el-form-item label="Email">
                  <el-input type="text" v-model="email" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="Password">
                  <el-input type="password" v-model="password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary">Login</el-button>
                </el-form-item>
              </el-form>
            </el-card>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { NavBar } from '@/components/navigation'
export default {
  name: 'LoginView',
  components: {
    'nav-bar': NavBar
  },
  data () {
    return {
      email: '',
      password: ''
    }
  }
}
</script>

<style scoped>
.login-card {
  margin-top: 33%;
  text-align: left;
}
</style>