<script lang="ts" setup>
  useHead({
    title: 'Email Toolkit'
  })

  const router = useRouter()
  const routes = router.getRoutes()

  // Filter out index route as this is already the index page
  const toolsToLink = computed(() => {
    return routes.filter(r => r.path !== '/')
  })
</script>

<template>
  <div class="flex flex-col items-center">
    <NuxtLink v-for="route in toolsToLink" :to="route.path" class="block text-xl rounded text-center px-4 py-2 uppercase leading-8 text-white bg-blue-600 hover:bg-blue-800 border-none cursor-pointer w-80 mt-6">
      {{ route.name }}
    </NuxtLink>
  </div>
</template>

<style scoped></style>
