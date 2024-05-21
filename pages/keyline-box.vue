<script lang="ts" setup>
useHead({
  title: 'Keyline Box'
})
definePageMeta({
  name: 'Keyline Box'
})

const boxWidth = ref<number>(500);
const borderWidth = ref<number>(2);
const borderRadius = ref<number>(10);
const overlapOffset = ref<number>(18);

const outputHTML = computed<string>(() => `
<!--[if mso]>
<v:rect xmlns:v="urn:schemas-microsoft-com:vml" stroked="false" filled="false" style="width:600px;position: relative; top:${(overlapOffset.value / 2) - borderRadius.value}px; z-index:2">
<v:textbox inset="0,0,0,0" style="mso-fit-shape-to-text:true;">
<table cellspacing="0" cellpadding="0" border="0" align="center" role="presentation">
    <tr><td style="background-color:#ffffff; padding:0 20px;">
<![endif]-->
<div style="max-height:${overlapOffset.value}px;">
  <div style="display:inline-block;background-color:#ffffff; padding:0 20px;" class="deviceWidth70 plr10">
    Header copy
  </div>
</div>
  <!--[if mso]>
</td></tr>
</table>
<p style="margin:0;mso-hide:all"><o:p xmlns:o="urn:schemas-microsoft-com:office:office">&nbsp;</o:p></p>
</v:textbox></v:rect>
<![endif]-->

<table cellspacing="0" cellpadding="0" align="center" border="0" width="${boxWidth.value}" style="width:${boxWidth.value}px;" role="presentation" class="deviceWidth90">
  <tr>
    <td style="background-image: url('https://res.newsletter.contact.sky/res/img/8F68D8CAC34EE657F602EFA76E23FC3E.png'); background-size: 100% 100%; background-color: #0023ff; padding: ${borderWidth.value}px; mso-padding-alt:0; border-radius:${borderRadius.value}px;" align="center">
    <!--[if mso]>
    <v:rect style="width:${boxWidth.value * 0.75}pt" stroke="false">
    <v:fill type=gradient color="#ff8c00" color2="#19a0ff" colors="5% #ff8c00, 25% #ff0064, 40% #ff00a0, 60% #8c28ff, 80% #0023ff, 95% #19a0ff" angle="270"/>
    <v:textbox inset="0,0,0,0" style="mso-fit-shape-to-text:true;">
      <table cellspacing="0" cellpadding="0" border="0" width="100%" role="presentation">
        <tr>
        <td style="width:${borderWidth.value}px"></td>
        <td style="padding:${borderWidth.value}px ${borderWidth.value}px ${borderWidth.value}px 0px;">
    <![endif]-->

      <table cellspacing="0" cellpadding="0" border="0" width="100%" role="presentation">
        <tr>
          <td style="background-color:#ffffff; padding:30px 0; border-radius:${borderRadius.value - borderWidth.value}px;" align="center">
            
            

          </td>
        </tr>
      </table>

    <!--[if mso]>
          </td>
        </tr>
      </table>
      <p style="margin:0;mso-hide:all"><o:p xmlns:o="urn:schemas-microsoft-com:office:office">&nbsp;</o:p></p>
    </v:textbox>
    </v:rect>
    <![endif]-->
    </td>
  </tr>
</table>
`);

const { copy } = useClipboard()
const copyBtnText = ref<string>('copy to clipboard')

function clipboardCopy () {
  copy(outputHTML.value)
  copyBtnText.value = 'copied!'

  setTimeout(() => {
    copyBtnText.value = 'copy to clipboard'
  }, 1000)
}
</script>

<template>
  <UContainer class="mt-8 space-y-8 text-center">
      
      <div class="justify-self-center self-center grid grid-cols-2 gap-6">

        <UFormGroup label="Box Width:">
          <UInput v-model="boxWidth" type="number"/>
        </UFormGroup>

        <UFormGroup label="Border Width:">
          <UInput v-model="borderWidth" type="number"/>
        </UFormGroup>

        <UFormGroup label="Border Radius:">
          <UInput v-model="borderRadius" type="number"/>
        </UFormGroup>

        <UFormGroup label="Overlap:">
          <UInput v-model="overlapOffset" type="number"/>
        </UFormGroup>

      </div>


      <div class="w-[600px] py-4 bg-white dark:text-black rounded-md shadow-sm ring-1 ring-gray-300 text-3xl">
        <div v-html="outputHTML" />
      </div>

      <UButton @click="clipboardCopy">{{ copyBtnText }}</UButton>

  </UContainer>
</template>
