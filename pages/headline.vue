<script setup lang="ts">
import * as spectrum from '~/util/spectrumGradients.js'

useHead({
  title: 'Headline'
})

const input = ref('')
const filenameText = ref('headline')
const fontSize = ref(40)
const lineHeight = ref(44)
const imageWidth = ref(600)
const gradientSelected = ref('Spectrum')
</script>

<template>
  <UContainer class="self-center">
    <UFormGroup label="Text:">
      <UTextarea v-model="input" :rows="4" autoresize />
    </UFormGroup>

    <UFormGroup label="Image Width:">
      <UInput v-model="imageWidth" type="number"/>
    </UFormGroup>

    <UFormGroup label="Font Size:">
      <UInput v-model="fontSize" type="number"/>
    </UFormGroup>

    <UFormGroup label="Line Height:">
      <UInput v-model="lineHeight" type="number"/>
    </UFormGroup>

    <UFormGroup label="Gradient:">
      <USelectMenu v-model="gradientSelected" :options="spectrum.gradientOptions" />
    </UFormGroup>

    <UFormGroup label="Filename:">
      <UInput v-model="filenameText" />
    </UFormGroup>

    <UFormGroup label="Output (click to download):">
      <SpectrumCanvasText 
        :inputText="input"
        :fontSize="fontSize"
        :lineHeight="lineHeight"
        :width="imageWidth"
        :gradient="gradientSelected"
        :filename="filenameText"
      />
    </UFormGroup>

  </UContainer>
</template>