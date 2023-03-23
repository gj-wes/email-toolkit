<script lang="ts" setup>
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark()
const toggleDark = useToggle(isDark)

const buttonIcon = computed(() => isDark.value ? '🌙' : '☀️')

const router = useRouter()
const currentToolName = computed(() => {
  if (router.currentRoute.value.name === 'index') return null
  return router.currentRoute.value.name
})
</script>

<template>
  <header class="flex justify-between py-2 px-5 border-b border-black dark:border-gray-100">
    <NuxtLink to="/">ETK</NuxtLink>

    <h1 class="capitalize">
      {{ currentToolName }}
    </h1>

    <div class="toggle-container">
      <button @click="toggleDark()" class="bg-none rounded py-0 px-2 border border-black dark:border-gray-100 text-inherit">{{ buttonIcon }}</button>
    </div>
  </header>
</template>
