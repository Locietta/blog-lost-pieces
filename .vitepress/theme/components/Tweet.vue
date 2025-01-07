<template>
  <WarppedTweet :id="resolvedId">
    <template #node:fallback>
      <div style="font-weight: bold">[[Error Occurred When Loading Tweet!]]</div>
    </template>
  </WarppedTweet>
</template>
<script lang="ts" setup>
import { applyPureReactInVue } from 'veaury'
import { Tweet as ReactTweet } from 'react-tweet'

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

const WarppedTweet = applyPureReactInVue(ReactTweet)
</script>
<style>
.react-tweet-theme {
  margin: auto !important;
}
</style>
