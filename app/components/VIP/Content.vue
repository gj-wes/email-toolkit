<script setup>
defineProps({
    headingText: String,
    imgUrl: [String, Array],
    text: String,
    ctaUrl: String,
    ctaText: String,
    type: {
        type: String,
        default: 'large',
        validator: value => ['large', 'cols'].includes(value)
    }
})
</script>

<template>
    <VIPHeading>
        {{ headingText }}
    </VIPHeading>

    <div v-if="type === 'cols'" class="inline-flex w-[500px] gap-2">
        <img v-for="(url, index) in (Array.isArray(imgUrl) ? imgUrl.slice(0, 3) : [imgUrl, imgUrl, imgUrl])" 
            :key="index" 
            :src="url" 
            alt="" 
            class="flex-1 rounded-[5px]">
    </div>

    <img v-else :src="imgUrl" alt="">

    <VIPCopy>
        {{ text }}
    </VIPCopy>

    <VIPCTA :url="ctaUrl">
        {{ ctaText }}
    </VIPCTA>
</template>