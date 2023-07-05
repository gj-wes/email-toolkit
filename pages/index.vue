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
    <UButton v-for="route in toolsToLink" :to="route.path" class="w-80 mt-6">
      {{ route.name }}
    </UButton>
  </div>
</template>

<style scoped></style>
