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
              <el-form label-width="120px" >
                <el-form-item label="Email" :error="error">
                  <el-input type="text" v-model="email" autocomplete="off" @focus="clearError"></el-input>
                </el-form-item>
                <el-form-item label="Password" :error="error">
                  <el-input type="password" v-model="password" autocomplete="off" @focus="clearError"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click.native="login">Login</el-button>
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
import gql from 'graphql-tag'
import cookie from 'js-cookie'

const loginMutation = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`
export default {
  name: 'LoginView',
  components: {
    'nav-bar': NavBar
  },
  data () {
    return {
      email: '',
      password: '',
      error: '',
    }
  },
  methods: {
    clearError () {
      this.error = ''
    },
    login () {
      this.$apollo.mutate({
        mutation: loginMutation,
        variables: {
          email: this.email,
          password: this.password
        }
      })
        .then(({data}) => {
          const {login} = data
          cookie.set('auth_token', login.token)
          this.$router.push('/tasks')
        })
        .catch(() => {
          this.error = 'Email or password incorrect' 
        })
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