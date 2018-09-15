<template>
  <div>
    <user-list/>
  </div>
</template>

<script>
import { UserList } from '@/components/users'

export default {
  name: 'UserView',
  components: {
    'user-list': UserList
  }
}
</script>