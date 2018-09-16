<template>
  <el-input 
    v-model="search" 
    class="search-bar"
    placeholder="Search"
    :suffix-icon="!loading ? 'el-icon-search' : 'el-icon-loading'" 
    @keyup.enter.native="onEnter"/>
</template>

<script>
export default {
  name: 'Search',
  data () {
    return {
      loading: false,
      search: ''
    }
  },
  methods: {
    onEnter () {
      this.$emit('search', this.search)
    }
  }
}
</script>

<style>
.search-bar {
  margin-top: 6px;
}
</style>