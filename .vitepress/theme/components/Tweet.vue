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

const TWEET_URL_REGEX =
  /^(https?:\/\/)?(www\.)?twitter\.com\/.*\/status(?:es)?\/(?<tweetId>[^/?]\d+)$/i
const TWEET_ID_REGEX = /^\d+$/

const props = defineProps<TweetProps>()
const { id, url } = props

if (id && url) {
  throw new Error('Cannot provide both tweet id and tweet url.')
}

const resolvedId = (() => {
  if (id) {
    if (!TWEET_ID_REGEX.test(id)) {
      throw new Error('Invalid tweet id, please provide a valid numerical id.')
    }
    return id
  }
  if (url) {
    const match = url.trim().match(TWEET_URL_REGEX)
    if (!match?.groups?.tweetId) {
      throw new Error('Invalid tweet url.')
    }
    return match.groups.tweetId
  }
  throw new Error('Must provide either tweet-id or tweet-url.')
})()

const WarppedTweet = applyPureReactInVue(ReactTweet)
</script>
<style>
.react-tweet-theme {
  margin: auto !important;
}
</style>
