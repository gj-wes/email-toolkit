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


const gradientSelected = ref('brandMain')

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
  <div class="grid grid-cols-2">

    <div class="justify-self-center self-center flex flex-col grid grid-cols-2 gap-6">
      <div>

        <div>
          <label class="block" for="filename">Filename:</label>
          <input class="mb-4 pl-1 border border-gray-400 bg-inherit" id="filename" type="text" v-model="filename">
        </div>
  
        <div>
          <label class="block" for="containerWidth">Image Width:</label>
          <input class="mb-4 pl-1 border border-gray-400 bg-inherit" id="containerWidth" type="number" v-model="containerWidth">
        </div>
  
        <div>
          <label class="block" for="containerHeight">Image Height:</label>
          <input class="mb-4 pl-1 border border-gray-400 bg-inherit" id="containerHeight" type="number" v-model="containerHeight">
        </div>
  
        <div>
          <label class="block" for="price">Price:</label>
          <input class="mb-4 pl-1 border border-gray-400 bg-inherit" id="price" type="text" v-model="price">
        </div>
  
        <div>
          <label class="block" for="rack">Rack:</label>
          <input class="mb-4 pl-1 border border-gray-400 bg-inherit" id="rack" type="text" v-model="rack">
        </div>
  
        <fieldset class="mb-4" name="fontWeight">
          <legend>Weight:</legend>
  
          <div>
            <input v-model="weight" type="radio" name="weight" value="bold" id="fontBold" checked>
            <label for="fontBold" class="ml-2">Bold</label>
          </div>
  
          <div>
            <input v-model="weight" type="radio" name="weight" id="fontReg" value="reg">
            <label for="fontReg" class="ml-2">Regular</label>
          </div>
        </fieldset>
  
        <fieldset class="mb-4" name="currency">
          <legend>Currency:</legend>
  
          <div>
            <input v-model="denom" type="radio" name="denom" value="gbp" id="currGBP" checked>
            <label for="currGBP" class="ml-2">£</label>
          </div>
  
          <div>
            <input v-model="denom" type="radio" name="denom" id="currEUR" value="eur">
            <label for="currEUR" class="ml-2">€</label>
          </div>
        </fieldset>
      </div>

      <div>
        <div>
          <label class="block" for="spectrum">Gradient:</label>
          <select class="mb-4 pl-1 border border-gray-400 bg-inherit" name="spectrum" id="spectrum" v-model="gradientSelected">
            <option value="brandMain">Standard spectrum</option>
            <option value="brandMainOld">Spectrum old</option>
            <option value="mobile">Mobile</option>
            <option value="broadband">Broadband</option>
            <option value="tv">TV</option>
          </select>
        </div>
  
        <div>
          <label class="block" for="priceFontSize">Price Font Size:</label>
          <input class="mb-4 pl-1 border border-gray-400 bg-inherit" id="priceFontSize" type="number" v-model="priceFontSize">
        </div>
    
        <div>
          <label class="block" for="denomFontSize">Currency Font Size:</label>
          <input class="mb-4 pl-1 border border-gray-400 bg-inherit" id="denomFontSize" type="number" v-model="denomFontSize">
        </div>
  
        <div>
          <label class="block" for="rackFontSize">Rack Font Size:</label>
          <input class="mb-4 pl-1 border border-gray-400 bg-inherit" id="rackFontSize" type="number" v-model="rackFontSize">
        </div>
  
        <div>
          <label class="block" for="lockupOffset">Offset:</label>
          <input class="mb-4 pl-1 border border-gray-400 bg-inherit" id="lockupOffset" type="number" v-model="lockupOffset">
        </div>
  
        <div>
          <label class="block" for="hideRack">Hide Rack Price:</label>
          <input type="checkbox" v-model="hideRack" id="hideRack">
        </div>
  
        <fieldset class="mb-4" name="scale">
          <legend>Scale:</legend>
  
          <div>
            <input v-model="scale" type="radio" name="scale" value="1" id="scalex1" checked>
            <label for="scalex1" class="ml-2">1x</label>
          </div>
  
          <div>
            <input v-model="scale" type="radio" name="scale" value="1.5" id="scalex15">
            <label for="scalex15" class="ml-2">1.5x</label>
          </div>
          
          <div>
            <input v-model="scale" type="radio" name="scale" value="2" id="scalex2">
            <label for="scalex2" class="ml-2">2x</label>
          </div>
       </fieldset>
      </div>

      <TheButton @click="generate">Generate</TheButton>


    </div>

    <div class="justify-self-center self-center">

      <p>
        Preview:
      </p>
      
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

      <p>
        Image:
      </p>
      <a v-if="output" :href="output" :download="filename" class="download">
        <img :src="output" alt="" class="border border-gray-400">
      </a>

    </div>

  </div>
</template>