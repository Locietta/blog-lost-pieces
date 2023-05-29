import { defineComponent, h } from 'vue'

if (!import.meta.env.SSR) {
  import('img-comparison-slider')
}

export const ImgComparisonSlider = defineComponent({
  name: 'ImgComparisonSlider',
  setup(_, { slots }) {
    return () => h('img-comparison-slider', slots.default?.())
  }
})
