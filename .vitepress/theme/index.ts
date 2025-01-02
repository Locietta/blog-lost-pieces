import type { EnhanceAppContext } from 'vitepress'

import DefaultTheme from 'vitepress/theme'

import Tweet from './components/Tweet.vue'
import Shade from './components/Shade.vue'
import Compare from './components/Compare.vue'

import { setup } from '@css-render/vue3-ssr'
import { NaiveUIProvider } from './naive-ui-vp-wrapper'

import './custom.css'
import 'katex/dist/katex.min.css'

export default {
  ...DefaultTheme,
  Layout: NaiveUIProvider,
  enhanceApp({ app }: EnhanceAppContext) {
    // register global compoment
    app.component('Tweet', Tweet)
    app.component('Shade', Shade)
    app.component('Compare', Compare)

    // naive-ui
    if (import.meta.env.SSR) {
      const { collect } = setup(app)
      app.provide('css-render-collect', collect)
    }
  },
}
