<template>
  <el-input 
    v-model="search" 
    class="search-bar"
    placeholder="Search"
    suffix-icon="el-icon-search" />
</template>

<script>
export default {
  name: 'Search',
  data () {
    return {
      search: ''
    }
  }
}
</script>

<style>
.search-bar {
  margin-top: 6px;
}
</style>