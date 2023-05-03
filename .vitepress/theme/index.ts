import type { EnhanceAppContext } from 'vitepress'

import DefaultTheme from 'vitepress/theme'

import NewLayout from './components/NewLayout.vue'
import Archives from './components/Archives.vue'
import Tags from './components/Tags.vue'
import Page from './components/Page.vue'
import { Tweet } from './components/twitter'
import Shade from './components/Shade.vue'

import './custom.css'
import 'katex/dist/katex.min.css'

export default {
  ...DefaultTheme,
  Layout: NewLayout,
  enhanceApp({ app }: EnhanceAppContext) {
    // register global compoment
    app.component('Tags', Tags)
    app.component('Archives', Archives)
    app.component('Page', Page)
    app.component('Tweet', Tweet)
    app.component('Shade', Shade)
  }
}
