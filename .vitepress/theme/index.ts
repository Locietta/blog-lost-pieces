import type { Theme } from 'vitepress'

import DefaultTheme from 'vitepress/theme'

import Tweet from '@components/Tweet.vue'
import Spoiler from '@/theme/components/Spoiler.vue'
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
    app.component('Spoiler', Spoiler)
    app.component('LinkCard', LinkCard)
  },
} satisfies Theme
