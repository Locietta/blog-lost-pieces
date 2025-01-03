<template>
  <ImgComparisonSlider class="img-compare">
    <!-- eslint-disable vue/no-deprecated-slot-attribute -->
    <figure
      slot="first"
      class="before"
    >
      <img
        title="Before Image"
        :src="before"
      />
      <figcaption v-if="tag">{{ beforeTag }}</figcaption>
    </figure>
    <figure
      slot="second"
      class="after"
    >
      <img
        title="After Image"
        :src="after"
      />
      <figcaption v-if="tag">{{ afterTag }}</figcaption>
    </figure>
    <svg
      slot="handle"
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
    <!-- eslint-enable vue/no-deprecated-slot-attribute -->
  </ImgComparisonSlider>
  <figcaption
    v-if="title"
    class="img-compare-title"
  >
    {{ title }}
  </figcaption>
</template>
<script setup lang="ts">
import { ImgComparisonSlider } from '@img-comparison-slider/vue'

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
    title: '',
  },
)
</script>
<style>
:root {
  --cmp-tag-bg: #eff6ff;
  --cmp-tag-text: #2e3452;
}

.dark {
  --cmp-tag-bg: #2e3452;
  --cmp-tag-text: #eff6ff;
}
</style>
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

.before {
  margin: 0;
  figcaption {
    left: 2%;
  }
}

.after {
  margin: 0;
  figcaption {
    right: 2%;
  }
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
</style>
