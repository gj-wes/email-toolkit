<script lang="ts" setup>
import ejs from 'ejs'
import { footerStart, footerEnd, gridSTV, gridCIN, fixDecimal, forwardXDays } from '~/util/logik-includes.js'

useHead({
  title: 'Logik',
  script: ['https://cdnjs.cloudflare.com/ajax/libs/ace/1.16.0/ace.js']
})

let editor;
const input = ref('')

// initialise ACE editor
onMounted(() => {
  // ace imported from script and on the window
  editor = ace.edit("editor");
  editor.setTheme("ace/theme/monokai");
  editor.getSession().setMode("ace/mode/ejs");
  editor.getSession().setUseWrapMode(true);
  editor.setOptions({ tabSize: 2})
  editor.setValue('Paste HTML code here');
  editor.focus();

  editor.on('change', () => {
    input.value = editor.getValue()
  });
})

const targetDataInput = ref('')

const getTargetData = (html) => {
  const targetDataRegex = /(targetData\.[a-zA-Z0-9_-]+)/gm;
  
  const dataMatches = html.match(targetDataRegex);
  const uniqueFields = Array.from(new Set(dataMatches))

  const flags = uniqueFields.reduce((a, v) => ({...a, [v.slice(11)]:''}), {})
  targetDataInput.value = JSON.stringify(flags)
}

const dataObj = computed(() => {
  let targetData = JSON.parse(targetDataInput.value)
  return {
    recipient: {
      rcpContactPIIContactInfo: {
        cb_name_forename: 'Joe',
        cb_name_surname: 'Bloggs',
      },
      rcpAcctAccountDimInfo: {
        currency_code: 'GBP'
      },
      rcpAccountKeys: {
        sky_id: '666'
      },
      firstName: 'Joe',
      email: 'joe.bloggs@sky.uk',
      cryptedId: '666666666'
    },
    message: {
      address: 'joe.bloggs@sky.uk'
    },
    escapeUrl (num) {
      return num
    },
    targetData
  }
})

const inputHTML = computed(() => {
  let processed = input.value
                    .replace("<%@ include view='MirrorPageUrl' %>", 'https://www.sky.com/')
                    .replace(/<%@\s*include\s*view='Footer_\w*START'\s*%>/gm, footerStart)
                    .replace("<%@ include view='Footer_END' %>", footerEnd)
                    .replace("<%@ include view='STV_Personalised_Hero_Grid_Master' %>", gridSTV)
                    .replace("<%@ include view='CinemaWeekly_Personalised_Hero_Grid' %>", gridCIN)
                    .replace("<%@ include view='fixDecimal' %>", fixDecimal)
                    .replace("<%@ include view='forwardXDays' %>", forwardXDays)
  return processed;
})

const dataTextarea = ref(null)
function updateTextareaHeight (e) {
  e.style.height = `${e.scrollHeight}px`
}

const output = ref('')
const updateOutput = async () => {
  if (targetDataInput.value === '') {
    await getTargetData(input.value)
  }
  updateTextareaHeight(dataTextarea.value)
  output.value = ejs.render(inputHTML.value, dataObj.value)
}

watch(input, updateOutput)
</script>

<template>
  <div class="grid grid-cols-[1fr_640px]">
    <div class="relative flex flex-col">
      <textarea 
        v-if="targetDataInput" 
        v-model="targetDataInput" 
        @keyup="updateOutput" 
        ref="dataTextarea"
        class="w-full resize-none bg-inherit border-black dark:border-gray-100 border-r border-b p-1 shrink-0">
      </textarea>
      
      <div id="editor" class="w-full h-full"></div>
    </div>

    <iframe frameborder="0" class="w-full h-screen" :srcdoc="output"></iframe>
  </div>
</template>

<style scoped></style>
