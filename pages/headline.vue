<script setup lang="ts">
useHead({
  title: 'Headline'
})

const input = ref('')
const filenameText = ref('headline')
const fontSize = ref(40)
const lineHeight = ref(44)
const imageWidth = ref(600)
const gradient = ref('brandMain')
</script>

<template>
  <div class="self-center mx-auto max-w-3xl">
    <label class="block" for="inputText">Text:</label>
    <textarea cols="50" rows="4" v-model="input" class="resize-none" id="inputText"></textarea>

    <div>
      <label class="block" for="imageWidth">Image Width:</label>
      <input class="mb-4 pl-1 border border-gray-400 bg-inherit" id="imageWidth" type="number" v-model="imageWidth">
    </div>
    <div>
      <label class="block" for="fontSize">Font Size:</label>
      <input class="mb-4 pl-1 border border-gray-400 bg-inherit" id="fontSize" type="number" v-model="fontSize">
    </div>
    <div>
      <label class="block" for="lineHeight">Line Height:</label>
      <input class="mb-4 pl-1 border border-gray-400 bg-inherit" id="lineHeight" type="number" v-model="lineHeight">
    </div>
    <div>
      <label class="block" for="spectrum">Gradient:</label>
      <select class="mb-4 pl-1 border border-gray-400 bg-inherit" name="spectrum" id="spectrum" v-model="gradient">
        <option value="brandMain">Standard spectrum</option>
        <option value="brandMainOld">Old spectrum</option>
        <option value="mobile">Mobile</option>
        <option value="broadband">Broadband</option>
        <option value="tv">TV</option>
      </select>
    </div>
    <div>
      <label class="block" for="price">Filename:</label>
      <input class="mb-4 pl-1 border border-gray-400 bg-inherit" id="price" type="text" v-model="filenameText">
    </div>

    <label class="block">Output (click to download):</label>
    <SpectrumCanvasText 
      :inputText="input"
      :fontSize="fontSize"
      :lineHeight="lineHeight"
      :width="imageWidth"
      :gradient="gradient"
      :filename="filenameText"
    />
  </div>
</template>