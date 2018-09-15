import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/views/Home.vue'
import Tasks from '@/views/Tasks.vue'
import Templates from '@/views/Templates.vue'
import Users from '@/views/Users.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
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
    }
  ]
})
