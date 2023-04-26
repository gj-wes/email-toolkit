<script setup lang="ts">
import { VAceEditor } from 'vue3-ace-editor';
import 'ace-builds/src-noconflict/mode-ejs';
import 'ace-builds/src-noconflict/theme-monokai';

const input = ref('')

function editorInit(editor: any) {
  // needed to init editor component
  return;
}

const emits = defineEmits(['update', 'clear'])
function inputUpdate() {
  emits('update', input.value)
}

watch(input, inputUpdate)

function clear() {
  input.value = ''
  emits('clear')
}
</script>
<template>
  <v-ace-editor
  v-model:value="input"
  @init="editorInit"
  @change="inputUpdate"
  lang="ejs"
  theme="monokai"
  wrap
  style="height:100%" />

  <TheButton v-if="input" class="absolute bottom-8 right-8" @click="clear">
    Clear
  </TheButton>
</template>