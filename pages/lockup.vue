<script setup lang="ts">
import * as spectrum from '~/util/spectrumGradients.js'

useHead({
  title: 'Lockup'
})

const containerWidth = ref(400)
const containerHeight = ref(104)

const containerStyles = computed(() => ({
  width: containerWidth.value + 'px', 
  height: containerHeight.value + 'px',
  display: 'flex',
  justifyContent: 'center',
  lineHeight:1,
  fontFamily: "'Sky Text', 'Sky Text Regular', Arial, Helvetica, sans-serif"
}))

const lockupOffset = ref(20)
const lockupStyles = computed(() => ({
  marginTop: '-' + lockupOffset.value + 'px',
  position: 'relative'
}))

const price = ref('XX')
const priceFontSize = ref(140)

const denom = ref('gbp')
const denomOutput = computed(() => denom.value == 'gbp' ? '£' : '€')
const denomFontSize = ref(90)
const denomStyles = computed(() => ({
  fontSize: denomFontSize.value + 'px'
}))

const rack = ref('XX')
const rackFontSize = ref(28)
const rackStyles = computed(() => ({
  margin: 0,
  fontSize: rackFontSize.value + 'px',
  color: '#4a4a4a',
  textAlign: 'right',
  position: 'absolute',
  top: lockupOffset.value + 'px',
  right: 'calc(100% - 40px)'
}))

const crossoutStyles = computed(() => ({
  width: 100 + '%',
  height: 100 + '%',
  backgroundColor: '#4a4a4a',
  position: 'absolute',
  top: 0,
  clipPath: 'polygon(95% 0, 100% 5%, 5% 100%, 0 95%)'
}))


const gradientSelected = ref('Spectrum')

const priceStyles = computed(() => ({
  margin: 0,
  fontSize: priceFontSize.value + 'px',
  backgroundImage: `linear-gradient(to right, ${spectrum[gradientSelected.value].string})`,
  webkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  webkitBackgroundClip: 'text',
}))

const weight = ref('bold')
const fontWeight = computed(() => ({
  fontWeight: weight.value == 'bold' ? 500 : 'normal'
}))

const hideRack = ref(false)

const scale = ref(1)

const filename = ref('price')

const capture = ref()
const output = ref()
async function generate() {
  output.value = await toPNG(capture.value, scale.value)
}

</script>
<template>
  <UContainer class="self-center">
    <div class="grid grid-cols-2 gap-4">
  
      <div class="justify-self-center self-center grid grid-cols-2 gap-6">
        <div>
  
          <UFormGroup label="Filename:">
            <UInput v-model="filename" />
          </UFormGroup>
  
          <UFormGroup label="Image Width:">
            <UInput v-model="containerWidth" type="number"/>
          </UFormGroup>
    
          <UFormGroup label="Image Height:">
            <UInput v-model="containerHeight" type="number"/>
          </UFormGroup>
  
          <UFormGroup label="Price:">
            <UInput v-model="price" />
          </UFormGroup>
  
          <UFormGroup label="Rack:">
            <UInput v-model="rack" />
          </UFormGroup>
          
          <UFormGroup label="Weight:">
            <URadio v-model="weight" name="weight" value="bold" label="Bold" />
            <URadio v-model="weight" name="weight" value="reg" label="Regular" />
          </UFormGroup>
  
          <UFormGroup label="Currency:">
            <URadio v-model="denom" name="denom" value="gbp" label="£" />
            <URadio v-model="denom" name="denom" value="eur" label="€" />
          </UFormGroup>
        </div>
  
        <div>
  
          <UFormGroup label="Gradient:">
            <USelectMenu v-model="gradientSelected" :options="spectrum.gradientOptions" />
          </UFormGroup>
  
          <UFormGroup label="Price Font Size:">
            <UInput v-model="priceFontSize" type="number"/>
          </UFormGroup>
  
          <UFormGroup label="Currency Font Size:">
            <UInput v-model="denomFontSize" type="number"/>
          </UFormGroup>
  
          <UFormGroup label="Rack Font Size:">
            <UInput v-model="rackFontSize" type="number"/>
          </UFormGroup>
  
          <UFormGroup label="Offset:">
            <UInput v-model="lockupOffset" type="number"/>
          </UFormGroup>
  
          <UFormGroup label="Hide Rack Price:">
            <UCheckbox v-model="hideRack" name="notifications"/>
          </UFormGroup>
  
         <UFormGroup label="Scale:">
            <URadio v-model="scale" name="scale" value="1" label="1x" />
            <URadio v-model="scale" name="scale" value="1.5" label="1.5x" />
            <URadio v-model="scale" name="scale" value="2" label="2x" />
          </UFormGroup>
        </div>
  
        <UButton @click="generate">
          Generate
        </UButton>
  
  
      </div>
  
      <div class="justify-self-center self-center">
  
        <UFormGroup label="Preview:">
          <div class="border border-gray-400">
            <div ref="capture" :style="containerStyles">
              <div :style="lockupStyles">
                <p v-if="!hideRack" :style="rackStyles">
                  {{ denomOutput }}{{ rack }}
                  <div :style="crossoutStyles"></div>
                </p>
                <p :style="priceStyles">
                  <span class="denom" :style="denomStyles">{{ denomOutput }}</span><span :style="fontWeight">{{ price }}</span>
                </p>
              </div>
            </div>
          </div>
        </UFormGroup>
        
  
        <UFormGroup label="Image (click to download):" v-if="output">
          <a :href="output" :download="filename" class="download">
            <img :src="output" alt="" class="border border-gray-400">
          </a>
        </UFormGroup>
  
      </div>
  
    </div>
  </UContainer>
</template>