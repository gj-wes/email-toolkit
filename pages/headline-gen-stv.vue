<script lang="ts" setup>
import downloadAll from '../util/downloadAll'

useHead({
  title: 'STV Headline Generator'
})
definePageMeta({
  name: 'STV Headline Generator'
})

const sundayTVItems = [
  'grid-header--dt',
  'grid-header--mb',
  'pod1-header--dt',
  'pod1-header--mb',
  'pod2-header--dt',
  'pod2-header--mb',
  'pod3-header--dt',
  'pod3-header--mb',
  'pod4-header--dt',
  'pod4-header--mb',
  'pod5-header--dt',
  'pod5-header--mb',
  'pod6-header--dt',
  'pod6-header--mb',
  'pod7-header--dt',
  'pod7-header--mb',
  'pod8-header--dt',
  'pod8-header--mb',
]

const downloadAllClick = () => {
  const downloadableLinks = [...document.querySelectorAll('a[hascopy="true"]')]
  downloadAll(downloadableLinks)
}
</script>

<template>
  <main class="grid grid-cols gap-8 p-8 place-content-center">
    <STVHeaderItem v-for="(item, ind) of sundayTVItems" :filename="item" :id="ind" :key="ind"/>
  </main>
  <button class="fixed bottom-8 right-8 text-xl rounded px-2 place-self-center uppercase leading-8 text-white bg-blue-600 hover:bg-blue-800 border-none cursor-pointer" @click.prevent="downloadAllClick">Download all</button>
</template>

<style scoped>
.grid-cols {
  grid-template-columns: repeat(auto-fill, 340px);
}
</style>
