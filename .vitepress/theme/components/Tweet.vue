<template>
  <WarppedTweet :id="id">
    <template v-slot:node:fallback>
      <div style="font-weight: bold">[[Error Occurred When Loading Tweet!]]</div>
    </template>
  </WarppedTweet>
</template>
<script lang="ts" setup>
import { applyPureReactInVue } from 'veaury'
import { Tweet as ReactTweet } from 'react-tweet'

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

type TweetProps = {
  /**
   * The numerical ID of the desired Tweet, or the full URL of the Tweet.
   * You should provide a Tweet ID or URL, but not both.
   *
   * @example
   *   <Tweet id="20" />
   *   <Tweet url="https://twitter.com/jack/status/20" />
   */
  id?: string
  url?: string
}

const TWEET_URL_REGEX = /^(https?:\/\/)?(www\.)?twitter\.com\/.*\/status(?:es)?\/(?<tweetId>[^\/\?]\d+)$/i
const TWEET_ID_REGEX = /^\d+$/

const props = defineProps<TweetProps>()
let { id, url } = props
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

const WarppedTweet = applyPureReactInVue(ReactTweet)
</script>
<style scoped>
.react-tweet-theme {
  margin: auto !important
}
</style>