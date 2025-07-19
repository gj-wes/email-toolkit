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

  <UButton class="fixed bottom-8 right-8" @click.prevent="downloadAllClick">
    Download all
  </UButton>
</template>

<style scoped>
.grid-cols {
  grid-template-columns: repeat(auto-fill, 340px);
}
</style>
