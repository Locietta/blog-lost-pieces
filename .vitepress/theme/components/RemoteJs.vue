<template>{{}}</template>

<script lang="ts" setup>
import { onMounted } from 'vue'

const props = defineProps<{ src: string }>()

onMounted(() => {
  const s = document.createElement('script')
  s.src = props.src
  s.type = 'text/javascript'
  s.defer = true
  document.body.appendChild(s)
})
</script>
