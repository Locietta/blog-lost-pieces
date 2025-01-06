/* eslint-disable vue/one-component-per-file */
import { defineComponent, h, inject } from 'vue'
import { useRoute, useData } from 'vitepress'
import { NConfigProvider, darkTheme, lightTheme } from 'naive-ui'
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
    const isDark = useData().isDark

    return h(
      NConfigProvider,
      { abstract: true, inlineThemeDisabled: true, theme: isDark.value ? darkTheme : lightTheme },
      {
        default: () => [
          h(LoiaLayout, null, { default: this.$slots.default?.() }),
          import.meta.env.SSR ? [h(CssRenderStyle), h(VitepressPath)] : null,
        ],
      },
    )
  },
})
