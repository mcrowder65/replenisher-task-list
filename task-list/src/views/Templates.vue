<template>
  <div>
    <template-list/>
  </div>
</template>

<script>
import { TemplateList } from '@/components/templates'
export default {
  name: 'TemplateView',
  components: {
    'template-list': TemplateList
  }
}
</script>