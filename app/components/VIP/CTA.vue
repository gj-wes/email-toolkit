<script setup>
defineProps({
    url: String,
})
</script>

<template>
    <a :href="url" target="_blank" class="bg-[#000FF5] text-white rounded-[5px] inline-block w-[500px] leading-[44px] align-middle text-[21px] sheen">
        <slot />
    </a>
</template>

<style scoped>
.sheen {
    background-image: linear-gradient(-1deg, transparent 49%, rgba(255, 255, 255, 0.15) 50%, rgba(225, 225, 225, 0));
}
</style>