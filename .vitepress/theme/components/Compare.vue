<template>
  <ImgCompare class="img-compare rendered">
    <template #first>
      <figure class="before">
        <img
          title="Before Image"
          :src="before"
        />
        <figcaption v-if="tag">{{ beforeTag }}</figcaption>
      </figure>
    </template>
    <template #second>
      <figure class="after">
        <img
          title="After Image"
          :src="after"
        />
        <figcaption v-if="tag">{{ afterTag }}</figcaption>
      </figure>
    </template>
    <template #handle>
      <svg
        class="animated-handle"
        xmlns="http://www.w3.org/2000/svg"
        width="100"
        viewBox="-8 -3 16 6"
      >
        <path
          stroke="#fff"
          d="M -4 -2 L -6 0 L -4 2 M -4 -2 L -4 2 M 4 -2 L 6 0 L 4 2 M 4 -2 L 4 2"
          stroke-width="1"
          fill="rgba(1.0, 1.0, 1.0, 0.3)"
          vector-effect="non-scaling-stroke"
        ></path>
      </svg>
    </template>
  </ImgCompare>
  <figcaption
    v-if="title"
    class="img-compare-title"
  >
    {{ title }}
  </figcaption>
</template>
<script setup lang="ts">
import { defineComponent, h } from 'vue'

if (!import.meta.env.SSR) {
  import('img-comparison-slider')
}

const ImgCompare = defineComponent({
  name: 'ImgCompare',
  setup(_, { slots }) {
    return () => h('img-comparison-slider', slots.default?.())
  }
})

withDefaults(
  defineProps<{
    before: string
    after: string
    title?: string
    tag?: boolean
    beforeTag?: string
    afterTag?: string
  }>(),
  {
    tag: false,
    beforeTag: 'Before',
    afterTag: 'After',
    title: ''
  }
)
</script>
<style scoped>
.img-compare-title {
  margin: 0 0 0.5rem 0;
}

:focus {
  outline: none;
}

/* disable hover animation for mobile devices */
@media screen and (min-width: 720px) {
  .animated-handle {
    transition: transform 0.2s;
  }
  .img-compare:hover .animated-handle {
    transform: scale(1.2);
  }
}

.before,
.after {
  margin: 0;
}

.before figcaption {
  left: 2%;
}

.after figcaption {
  right: 2%;
}

.before figcaption,
.after figcaption {
  font-size: large;
  font-weight: bold;
  background: var(--cmp-tag-bg);
  border-radius: 0.75rem;
  color: var(--cmp-tag-text);
  opacity: 0.7;
  padding: 0.75rem;
  position: absolute;
  top: 5%;
  line-height: 100%;
}

figcaption {
  font-size: small;
  display: block;
  text-align: center;
  color: var(--c-brand-light);
}
</style>
