<!-- fork from https://github.com/DannyFeliz/vue-tweet -->
<template>
  <slot
    v-if="isLoading"
    name="loading"
  ></slot>
  <slot
    v-else-if="hasError"
    name="error"
  ></slot>
  <div
    ref="tweetContainerRef"
    v-bind="$attrs"
  ></div>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, ref, useAttrs, watch } from 'vue'

const langs = [
  'ar',
  'bn',
  'cs',
  'da',
  'de',
  'el',
  'en',
  'es',
  'fa',
  'fi',
  'fil',
  'fr',
  'he',
  'hi',
  'hu',
  'id',
  'it',
  'ja',
  'ko',
  'msa',
  'nl',
  'no',
  'pl',
  'pt',
  'ro',
  'ru',
  'sv',
  'th',
  'tr',
  'uk',
  'ur',
  'vi',
  'zh-cn',
  'zh-tw'
] as const
const TWEET_URL_REGEX = /^(https?:\/\/)?(www\.)?twitter\.com\/.*\/status(?:es)?\/(?<tweetId>[^\/\?]\d+)$/i
const TWEET_ID_REGEX = /^\d+$/

type TweetProps = {
  /**
    The numerical ID of the desired Tweet.
    
    @example
      <Tweet id="20" />
   */
  id: string

  /**
    The Tweet URL.

    @example
      <Tweet url="https://twitter.com/jack/status/20" />
   */
  url: string

  /**
   * When set to none, only the cited Tweet will be displayed even if it is in reply to another Tweet.
   * @default "all"
   */
  conversation: 'all' | 'none'

  /**
   * When set to hidden, links in a Tweet are not expanded to photo, video, or link previews.
   * @default "visible"
   */
  cards: 'hidden' | 'visible'

  /**
   * The maximum width of the rendered Tweet in whole pixels. This value should be between 250 and 550 pixels.
   * @default "auto"
   */
  width: 'auto' | number

  /**
   * Float the Tweet left, right, or center relative to its container. Typically set to allow text or other content to wrap around the Tweet.
   * @default undefined
   */
  align: 'left' | 'right' | 'center' | undefined

  /**
   * When set to dark, displays Tweet with light text over a dark background.
   * @default "light"
   */
  theme: 'light' | 'dark'

  /**
   * A supported Twitter language code. Loads text components in the specified language. Note: does not affect the text of the cited Tweet.
   * @default "en"
   */
  lang: (typeof langs)[number]

  /**
   * When set to true, the Tweet and its embedded page on your site are not used for purposes that include personalized suggestions and personalized ads.
   * @default true
   */
  dnt: boolean
}

const props = withDefaults(defineProps<TweetProps>(), {
  conversation: 'all',
  cards: 'visible',
  width: 'auto',
  align: undefined,
  theme: 'light',
  lang: 'en',
  dnt: true
})

const emit = defineEmits<{
  'tweet-load-error': []
  'tweet-load-success': []
}>()

const isLoading = ref<boolean>(true)
const hasError = ref<boolean>(false)
const tweetContainerRef = ref<HTMLDivElement>()

onMounted(() => {
  renderTweet()
})

watch(props, () => {
  renderTweet()
})

function addScript(src: string, cb: () => void): void {
  const s = document.createElement('script')
  s.setAttribute('src', src)
  s.addEventListener('load', () => cb(), false)
  document.body.appendChild(s)
}

function getTweetParams() {
  let { id, url, ...tweetOptions } = props

  if (id && url) {
    throw new Error('Cannot provide both tweet id and tweet url.')
  } else if (id) {
    if (!TWEET_ID_REGEX.test(id)) {
      throw new Error('Invalid tweet id, please provide a valid numerical id.')
    }
  } else if (url) {
    const match = url.trim().match(TWEET_URL_REGEX)
    if (match && match.groups?.tweetId) {
      id = match.groups?.tweetId
    } else {
      throw new Error('Invalid tweet url.')
    }
  } else {
    throw new Error('Must provide either tweet-id or tweet-url.')
  }

  return {
    tweetId: id,
    tweetOptions
  }
}

function renderTweet(): void {
  if (!(window['twttr'] && window['twttr'].ready)) {
    addScript('https://platform.twitter.com/widgets.js', renderTweet)
    return
  }

  window['twttr'].ready().then(({ widgets }: any) => {
    isLoading.value = true
    hasError.value = false
    // Clear previously rendered tweet before rendering the updated tweet id
    if (tweetContainerRef.value) {
      tweetContainerRef.value.innerHTML = ''
    }

    const { tweetId, tweetOptions } = getTweetParams()

    widgets
      .createTweet(tweetId, tweetContainerRef.value, tweetOptions)
      .then(async (twitterWidgetElement: HTMLDivElement | undefined) => {
        // Since we're mutating the DOM directly with the embed we need to tell Vue wait until the DOM update
        await nextTick()

        if (twitterWidgetElement) {
          emit('tweet-load-success')
        } else {
          hasError.value = true
          emit('tweet-load-error')
        }
      })
      .finally(() => {
        isLoading.value = false
      })
  })
}
</script>
