<script lang="ts" setup>
import ejs from 'ejs'
import { VAceEditor } from 'vue3-ace-editor';
import 'ace-builds/src-noconflict/mode-ejs';
import 'ace-builds/src-noconflict/theme-monokai';

import { footerStart, footerEnd, gridSTV, gridCIN, cinWeeklyMovies, fixDecimal, forwardXDays } from '~/util/logik-includes.js'

useHead({
  title: 'Logik'
})

const input = ref('')

const targetDataInput = ref('{}')

const getTargetData = (html: string) => {
  const targetDataRegex = /(targetData\.[a-zA-Z0-9_-]+)/gm;
  
  const dataMatches = html.match(targetDataRegex);
  const uniqueFields = Array.from(new Set(dataMatches))

  const flags = uniqueFields.reduce((a, v) => ({...a, [v.slice(11)]:''}), {})
  targetDataInput.value = JSON.stringify(flags)
}

const dataObj = computed(() => {
  let tData = targetDataInput.value !== '{}' ? JSON.parse(targetDataInput.value) : null

  const recipient = {
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
    escapeUrl (num: number) {
      return num
    },
    targetData: {
      ...tData
    }
  }

  return recipient
})

const inputHTML = computed(() => {
  let processed = input.value
                    .replace("<%@ include view='MirrorPageUrl' %>", 'https://www.sky.com/')
                    .replace(/<%@\s*include\s*view='Footer_\w*START'\s*%>/gm, footerStart)
                    .replace("<%@ include view='Footer_END' %>", footerEnd)
                    .replace("<%@ include view='STV_Personalised_Hero_Grid_Master' %>", gridSTV)
                    .replace("<%@ include view='CinemaWeekly_Personalised_Hero_Grid' %>", gridCIN)
                    .replace("<%@ include view='CinemaWeekly_MoviesFromData' %>", cinWeeklyMovies)
                    .replace("<%@ include view='fixDecimal' %>", fixDecimal)
                    .replace("<%@ include view='forwardXDays' %>", forwardXDays)
  return processed;
})

const output = ref('')
const updateOutput = async () => {
  if (targetDataInput.value === '{}') {
    await getTargetData(input.value)
  }

  output.value = ejs.render(inputHTML.value, dataObj.value)
}

watch(input, updateOutput)

function editorInit(editor: any) {
  // needed to init editor component
  return;
}

function clear () {
  input.value = ''
  output.value = ''
  targetDataInput.value = '{}'
}
</script>

<template>
  <div class="grid grid-cols-[1fr_640px]">
    <div class="relative flex flex-col">
      <textarea 
        v-model="targetDataInput" 
        @keyup="updateOutput" 
        ref="dataTextarea"
        class="w-full bg-inherit border-black dark:border-gray-100 border-r border-b p-1 shrink-0">
      </textarea>
      
      <v-ace-editor
      v-model:value="input"
      @init="editorInit"
      lang="ejs"
      theme="monokai"
      wrap
      style="height:100%" />

      <button v-if="input" class="absolute bottom-8 right-8 text-xl rounded px-2 place-self-center uppercase leading-8 text-white bg-blue-600 hover:bg-blue-800 border-none cursor-pointer" @click="clear">Clear</button>
    </div>

    <iframe frameborder="0" class="w-full h-full" :srcdoc="output"></iframe>
  </div>
</template>

<style scoped></style>
