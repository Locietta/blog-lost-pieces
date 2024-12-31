import type { EnhanceAppContext } from 'vitepress'

import DefaultTheme from 'vitepress/theme'

import NewLayout from './components/NewLayout.vue'
import Archives from './components/Archives.vue'
import Tags from './components/Tags.vue'
import Page from './components/Page.vue'
import Tweet from './components/Tweet.vue'
import Shade from './components/Shade.vue'
import Compare from './components/Compare.vue'

import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { createVuetify } from 'vuetify'

const vuetify = createVuetify({ components, directives })

import 'vuetify/styles'
import './custom.css'
import 'katex/dist/katex.min.css'

export default {
  ...DefaultTheme,
  Layout: NewLayout,
  enhanceApp({ app }: EnhanceAppContext) {
    app.use(vuetify)
    // register global compoment
    app.component('Tags', Tags)
    app.component('Archives', Archives)
    app.component('Page', Page)
    app.component('Tweet', Tweet)
    app.component('Shade', Shade)
    app.component('Compare', Compare)
  },
}
