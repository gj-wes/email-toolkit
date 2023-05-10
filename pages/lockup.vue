<script setup lang="ts">
useHead({
  title: 'Lockup'
})

const generatedUrl = ref('')

const price = ref(0)
const rack = ref(0)
const weight = ref('')
const spectrum = ref('')

function generate() {
  let extraParams = '';

  if (weight.value.length) {
    extraParams += `&font=${weight.value}`
  }
  if (spectrum.value.length) {
    extraParams += `&spectrum=${spectrum.value}`
  }

  const serverlessUrl = `https://pso-serverless-test.netlify.app/.netlify/functions/lockup?price=${price.value}&rack=${rack.value}${extraParams}`
  generatedUrl.value = serverlessUrl
}

</script>
<template>
  <div class="grid grid-cols-2">

    <div class="justify-self-center self-center flex flex-col">
      <label for="price">Price:</label>
      <input class="mb-4 pl-1 border border-gray-400 bg-inherit" id="price" type="text" v-model="price">

      <label for="rack">Rack:</label>
      <input class="mb-4 pl-1 border border-gray-400 bg-inherit" id="rack" type="text" v-model="rack">

      <fieldset class="mb-4">
        <legend>Weight:</legend>

        <div>
          <input v-model="weight" type="radio" name="weight" value="" id="fontBold" checked>
          <label for="fontBold" class="ml-2">Bold</label>
        </div>

        <div>
          <input v-model="weight" type="radio" name="weight" id="fontReg" value="reg">
          <label for="fontReg" class="ml-2">Regular</label>
        </div>
      </fieldset>

      <label for="spectrum">Gradient:</label>
      <select class="mb-4 pl-1 border border-gray-400 bg-inherit" name="spectrum" id="spectrum" v-model="spectrum">
        <option value="">Standard spectrum</option>
        <option value="broadband">Broadband</option>
        <option value="tv">TV</option>
      </select>

      <TheButton @click="generate">Generate</TheButton>
    </div>

    <img :src="generatedUrl" alt="" class="justify-self-center self-center border border-gray-400">

  </div>
</template>