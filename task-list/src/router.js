import Vue from 'vue'
import Router from 'vue-router'
import cookie from 'js-cookie'

import Home from '@/views/Home.vue'
import Tasks from '@/views/Tasks.vue'
import Templates from '@/views/Templates.vue'
import Users from '@/views/Users.vue'
import Login from '@/views/Login.vue'

Vue.use(Router)

const router =  new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      beforeEnter: (to, from, next) => {
        if (cookie.get('auth_token')){
          next()
        } else {
          window.location.replace('/#/login')
        }
      },
      children: [
        {
          path: '/tasks',
          name: 'tasks',
          component: Tasks
        },
        {
          path: '/templates',
          name: 'templates',
          component: Templates
        },
        {
          path: '/users',
          name: 'users',
          component: Users
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
  ]
})

export default router
