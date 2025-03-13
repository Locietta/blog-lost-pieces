import type { Theme } from 'vitepress'

import DefaultTheme from 'vitepress/theme'

import Tweet from '@components/Tweet.vue'
import Shade from '@components/Shade.vue'
import LinkCard from '@components/LinkCard.vue'

import LoiaLayout from '@components/LoiaLayout.vue'

import '@theme/styles/app.css'
import 'katex/dist/katex.min.css'

export default {
  ...DefaultTheme,
  Layout: LoiaLayout,
  enhanceApp({ app }) {
    // register global compoment
    app.component('Tweet', Tweet)
    app.component('Shade', Shade)
    app.component('LinkCard', LinkCard)
  },
} satisfies Theme
