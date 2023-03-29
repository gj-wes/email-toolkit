<script lang="ts" setup>
const props = defineProps({
  filename: String,
  id: Number
})

const inputText = ref('')
const filenameText = ref('')

const canvasRef = ref(null)
const canvas = reactive({
  context: null,
  width: null,
  height: null
})
const text = reactive({
  font: null,
  lineHeight: null,
  lineCount: 1,
  textWidth: null
})

onMounted(() => {
  filenameText.value = props.filename

  // set canvas dimensions
  if (props.filename.endsWith('--mb')) {
    canvas.width = 640
    text.lineHeight = 50
    canvas.height = text.lineHeight * text.lineCount
    text.font = "48px 'Sky Text'"
  } else {
    canvas.width = 1200
    text.lineHeight = 68
    canvas.height = text.lineHeight * text.lineCount
    text.font = "60px 'Sky Text'"
  }
})

const gradient = computed(() => {
  const gradientSetting = canvas.context.createLinearGradient(
    (canvas.width / 2) - (text.textWidth / 2),
    canvas.height / 2,
    (canvas.width / 2) + (text.textWidth / 2),
    canvas.height / 2,
  );
  gradientSetting.addColorStop(0, "#ff9e00")
  gradientSetting.addColorStop(0.35, "#ff0000")
  gradientSetting.addColorStop(0.6, "#b5007d")
  gradientSetting.addColorStop(0.85, "#21429c")
  gradientSetting.addColorStop(1, "#0071ff")

  return gradientSetting;
})

const downloadUrl = ref('')
const updateDownloadUrl = () => {
  downloadUrl.value = canvasRef.value.toDataURL('image/png')
}

const updateCanvas = () => {
  // get canvas context
  canvas.context = canvasRef.value.getContext('2d')

  // clear canvas
  canvas.context.clearRect(0, 0, canvas.width, canvas.height)

  // set font style
  canvas.context.font = text.font
  canvas.context.textBaseline = "top"
  canvas.context.textAlign = "center"

  const lines = inputText.value.split('\n')
  text.lineCount = lines.length

  canvas.height = text.lineHeight * text.lineCount

  const longest = lines.reduce((longest, currentWord) => {
    return currentWord.length > longest.length ? currentWord : longest;
  }, "");
  let linePosition = 0;

  for (const line of lines) {
    // set textWidth to length of longest line
    if (line.length === longest.length) {
      text.textWidth = canvas.context.measureText(line).width;
    }
    canvas.context.fillStyle = gradient.value;
    
    canvas.context.fillText(line, canvas.width / 2, linePosition)
    linePosition += text.lineHeight

  }

  updateDownloadUrl()
}

watch(inputText, () => updateCanvas())

const hascopy = computed(() => inputText.value !== '' ? true : false)
</script>

<template>
  <div class="grid grid-cols-1 grid-rows-[66px_auto_22px] rounded p-4 item-shadow">
    <textarea class="w-full resize-none text-center border border-gray-400 bg-inherit" rows="4" v-model.trim="inputText" @keyup.enter="updateCanvas"></textarea>
    <div class="my-4">
      <a :href="downloadUrl" :download="filenameText" :hascopy="hascopy" class="download">
        <canvas 
          class="w-full h-auto align-middle border border-gray-400" 
          ref="canvasRef" 
          :width="canvas.width" 
          :height="canvas.height"
        ></canvas>
      </a>
    </div>
    <input type="text" class="w-full text-center border border-gray-400 bg-inherit" v-model.trim="filenameText">
  </div>
</template>

<style scoped>
.item-shadow {
  box-shadow: 0 1px 3px 1px rgba(0, 0, 0, 0.3);
}
.dark .item-shadow{
  box-shadow: 0 1px 3px 1px rgba(255, 255, 255, 0.3);
}
</style>