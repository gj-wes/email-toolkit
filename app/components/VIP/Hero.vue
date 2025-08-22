<script setup>
defineProps({
    imgUrl: String,
    text: String,
    ctaUrl: String,
    ctaText: String
})
</script>

<template>
    <div class="bg-black pb-4">
        <div class="hero-fade">
            <img :src="imgUrl" alt="" class="w-full"/>
        </div>
        <VIPCopy class="text-white">{{ text }}</VIPCopy>

        <div class="inline-flex gap-3 items-center">
            <img src="https://movableink-assets-production.s3.amazonaws.com/8767/b97d5d3e-3a03-4a67-99d8-c8b4f4770b46/98fb0f81-12bf-4a54-a363-64b9f2ab4147.png" alt="" class="w-[48px]">
            <span class="text-white font-bold">
                Download the My Sky app
            </span>
        </div>
    </div>

    <VIPCTA :url="ctaUrl">
        {{ ctaText }}
    </VIPCTA>
</template>

<style>
.hero-fade {
    position: relative;
    display: block;
}
.hero-fade::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 25%;
    background-image: linear-gradient(to top, #000, transparent);
    pointer-events: none;
}
</style>