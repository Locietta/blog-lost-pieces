<template>
  <div class="tweet-container vp-raw">
    <VueTweetPure :id="resolvedId">
      <template #node:fallback>
        <div style="font-weight: bold">[[Error Occurred When Loading Tweet!]]</div>
      </template>
    </VueTweetPure>
  </div>
</template>
<script lang="ts" setup>
import { Tweet as VueTweetPure } from 'vue-tweet-pure'
import 'vue-tweet-pure/style.css'

const props = defineProps<{
  /**
   * The numerical ID of the desired Tweet, or the full URL of the Tweet.
   *
   * @example
   *   <Tweet src="20" />
   *   <Tweet src="https://twitter.com/jack/status/20" />
   */
  src: string
}>()

const { src } = props

const resolvedId = (() => {
  if (/^\d+$/.test(src)) {
    return src
  }
  const TWEET_URL_REGEX =
    /^(https?:\/\/)?(www\.)?(twitter|x)\.com\/.*\/status(?:es)?\/(?<tweetId>[^/?]\d+)$/i
  const match = src.trim().match(TWEET_URL_REGEX)
  if (match?.groups?.tweetId) {
    return match.groups.tweetId
  }

  throw new Error('Invalid tweet id or url.')
})()
</script>
<style scoped>
.tweet-container {
  display: flex;
  justify-content: center;
}
</style>
