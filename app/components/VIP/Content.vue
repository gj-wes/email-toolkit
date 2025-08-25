<script setup>
const props = defineProps({
    headingText: String,
    imgUrl: [String, Array],
    text: String,
    ctaUrl: String,
    ctaText: String,
    type: {
        type: String,
        default: 'large',
        validator: value => ['large', 'cols'].includes(value)
    },
    csvColumns: {
        type: Object,
        default: () => ({
            headingText: 'headingText',
            imgUrl: 'imgUrl',
            text: 'text',
            ctaUrl: 'ctaUrl',
            ctaText: 'ctaText'
        })
    }
})

const missingFields = computed(() => {
    const missing = []
    if (!props.headingText) missing.push(props.csvColumns.headingText)
    
    // Check imgUrl - for arrays, check if any individual URLs are missing
    if (!props.imgUrl || (Array.isArray(props.imgUrl) && props.imgUrl.length === 0)) {
        missing.push(props.csvColumns.imgUrl)
    } else if (Array.isArray(props.imgUrl)) {
        // Check each URL in the array for missing values
        const hasEmptyUrl = props.imgUrl.some(url => !url || url.trim() === '')
        if (hasEmptyUrl) missing.push(props.csvColumns.imgUrl)
    }
    
    if (!props.text) missing.push(props.csvColumns.text)
    if (!props.ctaUrl) missing.push(props.csvColumns.ctaUrl)
    if (!props.ctaText) missing.push(props.csvColumns.ctaText)
    return missing
})
</script>

<template>
    <div v-if="missingFields.length > 0" class="text-red-500 my-6">
        <div v-for="field in missingFields" :key="field">
            <span class="font-bold">{{ field }}</span> missing content
        </div>
    </div>

    <template v-else>
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
</template>