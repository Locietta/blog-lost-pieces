/* eslint-disable vue/one-component-per-file */
import { defineComponent, h, inject } from 'vue'
import { useRoute } from 'vitepress'
import { NConfigProvider } from 'naive-ui'
import LoiaLayout from './components/LoiaLayout.vue'

const CssRenderStyle = defineComponent({
  setup() {
    const collect = inject<() => CSSStyleDeclaration>('css-render-collect')
    return {
      style: collect!(),
    }
  },
  render() {
    return h('css-render-style', {
      innerHTML: this.style,
    })
  },
})

const VitepressPath = defineComponent({
  setup() {
    const route = useRoute()
    return () => {
      return h('vitepress-path', null, [route.path])
    }
  },
})

export const NaiveUIProvider = defineComponent({
  render() {
    return h(
      NConfigProvider,
      { abstract: true, inlineThemeDisabled: true },
      {
        default: () => [
          h(LoiaLayout, null, { default: this.$slots.default?.() }),
          import.meta.env.SSR ? [h(CssRenderStyle), h(VitepressPath)] : null,
        ],
      },
    )
  },
})
