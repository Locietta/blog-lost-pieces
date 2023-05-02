<template>
  <ClientOnly>
    <div>
      <RemoteJs src="https://platform.twitter.com/widgets.js"></RemoteJs>
      <slot></slot>
    </div>
  </ClientOnly>
</template>
<script setup lang="ts">
import RemoteJs from './RemoteJs.vue'
</script>
