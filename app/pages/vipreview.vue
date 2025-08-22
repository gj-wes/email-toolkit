<script setup lang="ts">
import Papa from 'papaparse'

useHead({
  title: 'VIPreview'
})

const csvFile = ref<File | null>(null)
const fileOpened = ref(false)
const errorMessage = ref('')
const isDragOver = ref(false)
const csvData = ref<any[]>([])
const selectedIndex = ref(0)

// Component visibility controls
const showTacticalHero = ref(false)
const showSports = ref(true)
const showRewardsOnRepeat = ref(true)
const showExperience = ref(true)
const showEverydaySavings = ref(true)
const showTvCust = ref(true)
const showBbCust = ref(true)
const showMobileCust = ref(true)
const showTvBb = ref(true)
const showTvBbMobile = ref(true)
const showTvMobile = ref(true)
const showBbMobile = ref(true)
const showExtraEnt = ref(true)

function handleDragEnter(e: DragEvent) {
  e.preventDefault()
  isDragOver.value = true
}

function handleDragLeave(e: DragEvent) {
  e.preventDefault()
  isDragOver.value = false
}

function handleDragOver(e: DragEvent) {
  e.preventDefault()
}

async function handleDrop(e: DragEvent) {
  e.preventDefault()
  isDragOver.value = false
  
  const files = Array.from(e.dataTransfer?.files || [])
  
  if (files.length === 0) {
    return
  }

  if (files.length > 1) {
    errorMessage.value = 'Please drop only one CSV file at a time'
    return
  }

  const file = files[0]
  if (file) {
    processFile(file).catch(err => {
      console.error('Error processing file:', err)
      errorMessage.value = 'Error processing file'
    })
  }
}

async function handleFileInput(e: Event) {
  const target = e.target as HTMLInputElement
  const files = Array.from(target.files || [])
  
  if (files.length === 0) {
    return
  }

  const file = files[0]
  if (file) {
    processFile(file).catch(err => {
      console.error('Error processing file:', err)
      errorMessage.value = 'Error processing file'
    })
  }
}

async function processFile(file: File) {
  errorMessage.value = ''
  
  const fileExtension = file.name.split('.').pop()?.toLowerCase()
  const isCSV = fileExtension === 'csv' || file.type === 'text/csv'
  
  if (!isCSV) {
    errorMessage.value = 'Error: Please select a CSV file only'
    fileOpened.value = false
    csvFile.value = null
    return
  }

  try {
    const text = await file.text()
    await parseCSV(text)
    
    csvFile.value = file
    fileOpened.value = true
  } catch (error) {
    errorMessage.value = 'Error: Failed to read CSV file'
    fileOpened.value = false
    csvFile.value = null
  }
}

function parseCSV(text: string) {
  try {
    const result = Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      transform: (value: string) => value.trim()
    })
    
    if (result.errors.length > 0) {
      console.warn('CSV parsing errors:', result.errors)
    }
    
    csvData.value = result.data as any[]
    selectedIndex.value = 0
  } catch (error) {
    console.error('Error parsing CSV:', error)
    errorMessage.value = 'Error: Failed to parse CSV file'
  }
}

function toggleDataset() {
  selectedIndex.value = selectedIndex.value === 0 ? 1 : 0
}

const toggleBtnText = computed(() => {
  return selectedIndex.value === 0 ? 'UK' : 'ROI'
})

// const currentData = computed(() => {
//   return csvData.value.length > selectedIndex.value ? csvData.value[selectedIndex.value] : null
// })
fileOpened.value = true
csvData.value = 'test'
const currentData = {
  "mi_country": "GBP",
  "Main_Headline": "Check out your top rewards this week from Sky VIP",
  "Hero_Image_URL": "https://movableink-assets-production.s3.amazonaws.com/8767/37504626-1b19-4ce2-9e3c-a8e26600883c/446262d2-35f2-43dc-a3a0-399883df0bbc.png",
  "Hero_Copy": "Enter for a chance to win a trip to Universal Orlando Resort’s four amazing theme parks, including the new Universal Epic Universe, now open! This October, get ready to enjoy a 7-night holiday of non-stop awesome!",
  "Hero_CTA_Copy": "Enter now",
  "Hero_CTA_URL": "https://www.sky.com/app/vip?cat=Competition",
  "Tactical_Hero_Image_URL": "https://movableink-assets-production.s3.amazonaws.com/8767/440406e9-9992-41d0-9da9-df2436850dec/aeac0b2b-11b6-4bf6-84b2-071ff7833af6.png",
  "Tactical_Hero_Copy": "Enjoy 1 year of unlimited access to The Athletic, on us. Follow essential coverage of the teams you care about, through expert insights and analysis. From breaking the news and live commentary, The Athletic delivers every sports story that matters",
  "Tactical_Hero_CTA_Copy": "Claim now",
  "Tactical_Hero_CTA_URL": "https://www.sky.com/app/tab/vip",
  "Sports_Heading": "Your exclusive Sky Sports rewards",
  "Sports_1_Image_URL": "https://movableink-assets-production.s3.amazonaws.com/8767/0ceb087e-601e-4a14-baf1-43ac393cc2d6/0a5f484d-48b7-430e-9a0b-633dec2d2cca.png",
  "Sports_2_Image_URL": "https://movableink-assets-production.s3.amazonaws.com/8767/444a4082-6b7e-4722-a6d4-6c77cfe671f1/4050c593-8550-4aee-be42-45dbfc54089c.png",
  "Sports_3_Image_URL": "https://movableink-assets-production.s3.amazonaws.com/8767/2eca58ac-1202-46ea-8906-bc069e72a258/24d645e9-ac69-4129-8648-b73af770ac8f.png",
  "Sports_Copy": "Score big this season! Win Premier League tickets, enjoy a year of The Athletic for free, or save 25% on PowerLeague. Don’t miss your shot—claim your reward and kick off the ultimate football experience!",
  "Sports_CTA_Copy": "Find out more",
  "Sports_CTA_URL": "https://www.sky.com/app/tab/vip",
  "Rewards_on_Repeat_Heading": "A weekly treat, on us",
  "Rewards_on_Repeat_Image_URL": "https://movableink-assets-production.s3.amazonaws.com/8767/19659066-52f8-4a2e-ad24-64c4a93172f2/df9e2f62-ed48-4bc9-b38c-44ecb0f2d480.png",
  "Rewards_on_Repeat_Copy": "Tasty treat alert! Head to the My Sky app this week to claim your delicious reward from Sainsbury’s. Don’t miss out—tap in and treat yourself while it lasts!",
  "Rewards_on_Repeat_CTA_Copy": "Claim now",
  "Rewards_on_Repeat_CTA_URL": "https://www.sky.com/app/tab/vip",
  "Experience_Heading": "Check out our unforgettable experiences",
  "Experience_1_Image_URL": "https://movableink-assets-production.s3.amazonaws.com/8767/600bc6bf-7065-40c3-b9bf-7ddc6cd85af1/e8fe030b-71a6-4c0c-a6ef-4b6203b4f61e.png",
  "Experience_2_Image_URL": "https://movableink-assets-production.s3.amazonaws.com/8767/0b1ee144-d92b-4530-90e2-e32d99ba4ad4/2e52d9f1-b4c3-4302-8563-ca675e94989f.png",
  "Experience_3_Image_URL": "https://movableink-assets-production.s3.amazonaws.com/8767/5a610955-29d1-4e62-ad65-c5864995a4a2/4e88cdcc-a265-4659-af81-e295ea227421.png",
  "Experience_Copy": "Big wins await! Save on LEGOLAND® tickets, win an unforgettable night at Adventure Cinema, or bag a brand-new Sky Glass. Head to the My Sky app now and make your summer epic",
  "Experience_CTA_Copy": "Enter now",
  "Experience_CTA_URL": "https://www.sky.com/app/tab/vip",
  "Everyday_Savings_Heading": "Best-in-market discounts",
  "Everyday_Savings_Image_URL": "https://movableink-assets-production.s3.amazonaws.com/8767/ca94e388-86c3-42ab-87e6-c81c6bb9fbf2/f79b426b-1326-4ca6-b3dc-624670d0dbed.png",
  "Everyday_Savings_Copy": "Family getaway incoming! Save on your next holiday with exclusive offers just for Sky customers. Head to Everyday Discounts in the My Sky app and start planning your perfect break today.",
  "Everyday_Savings_CTA_Copy": "Claim now",
  "Everyday_Savings_CTA_URL": "https://www.sky.com/",
  "TV_Customers_Heading": "Extras on your Sky products",
  "TV_Customers_Image_URL": "https://movableink-assets-production.s3.amazonaws.com/8767/8f0bcd6b-a3fa-47a1-b9c6-1bc1322693e1/29129936-5d22-4e82-8f43-641a5c5e8361.png",
  "TV_Customers_Copy": "Stay protected for free! Sky customers can enjoy 12 months of Norton Security at no cost. Keep your devices safe and secure—head to the My Sky app now to claim your free trial.",
  "TV_Customers_CTA_Copy": "Claim now",
  "TV_Customers_CTA_URL": "https://www.sky.com/app/tab/vip",
  "BB_Customers_Heading": "Extras on your Sky products",
  "BB_Customers_Image_URL": "https://movableink-assets-production.s3.amazonaws.com/8767/8f0bcd6b-a3fa-47a1-b9c6-1bc1322693e1/29129936-5d22-4e82-8f43-641a5c5e8361.png",
  "BB_Customers_Copy": "Stay protected for free! Sky customers can enjoy 12 months of Norton Security at no cost. Keep your devices safe and secure—head to the My Sky app now to claim your free trial.",
  "BB_Customers_CTA_Copy": "Claim now",
  "BB_Customers_CTA_URL": "https://www.sky.com/app/tab/vip",
  "Mobile_Heading": "Extras on your Sky products",
  "Mobile_Image_URL": "https://movableink-assets-production.s3.amazonaws.com/8767/8f0bcd6b-a3fa-47a1-b9c6-1bc1322693e1/29129936-5d22-4e82-8f43-641a5c5e8361.png",
  "Mobile_Copy": "Stay protected for free! Sky customers can enjoy 12 months of Norton Security at no cost. Keep your devices safe and secure—head to the My Sky app now to claim your free trial.",
  "Mobile_CTA_Copy": "Claim now",
  "Mobile_CTA_URL": "https://www.sky.com/app/tab/vip",
  "TV_BB_Mobile_Heading": "Extras on your Sky products",
  "TV_BB_Mobile_Image_URL": "https://movableink-assets-production.s3.amazonaws.com/8767/8f0bcd6b-a3fa-47a1-b9c6-1bc1322693e1/29129936-5d22-4e82-8f43-641a5c5e8361.png",
  "TV_BB_Mobile_Copy": "Stay protected for free! Sky customers can enjoy 12 months of Norton Security at no cost. Keep your devices safe and secure—head to the My Sky app now to claim your free trial.",
  "TV_BB_Mobile_CTA_Copy": "Claim now",
  "TV_BB_Mobile_CTA_URL": "https://www.sky.com/app/tab/vip",
  "TV_BB_Heading": "Extras on your Sky products",
  "TV_BB_Image_URL": "https://movableink-assets-production.s3.amazonaws.com/8767/8f0bcd6b-a3fa-47a1-b9c6-1bc1322693e1/29129936-5d22-4e82-8f43-641a5c5e8361.png",
  "TV_BB_Copy": "Stay protected for free! Sky customers can enjoy 12 months of Norton Security at no cost. Keep your devices safe and secure—head to the My Sky app now to claim your free trial.",
  "TV_BB_CTA_Copy": "Claim now",
  "TV_BB_CTA_URL": "https://www.sky.com/app/tab/vip",
  "TV_Mobile_Heading": "Extras on your Sky products",
  "TV_Mobile_Image_URL": "https://movableink-assets-production.s3.amazonaws.com/8767/8f0bcd6b-a3fa-47a1-b9c6-1bc1322693e1/29129936-5d22-4e82-8f43-641a5c5e8361.png",
  "TV_Mobile_Copy": "Stay protected for free! Sky customers can enjoy 12 months of Norton Security at no cost. Keep your devices safe and secure—head to the My Sky app now to claim your free trial.",
  "TV_Mobile_CTA_Copy": "Claim now",
  "TV_Mobile_CTA_URL": "https://www.sky.com/app/tab/vip",
  "BB_Mobile_Heading": "Extras on your Sky products",
  "BB_Mobile_Image_URL": "https://movableink-assets-production.s3.amazonaws.com/8767/8f0bcd6b-a3fa-47a1-b9c6-1bc1322693e1/29129936-5d22-4e82-8f43-641a5c5e8361.png",
  "BB_Mobile_Copy": "Stay protected for free! Sky customers can enjoy 12 months of Norton Security at no cost. Keep your devices safe and secure—head to the My Sky app now to claim your free trial.",
  "BB_Mobile_CTA_Copy": "Claim now",
  "BB_Mobile_CTA_URL": "https://www.sky.com/app/tab/vip",
  "Extra_Entertainment_Heading": "Extras on your Sky products",
  "Extra_Entertainment_Image_URL": "https://movableink-assets-production.s3.amazonaws.com/8767/1abff1d5-b3f9-4192-89f1-374ed6ec5ade/36e5b9ff-7aa0-4898-a7d9-aea048549a71.png",
  "Extra_Entertainment_Copy": "Settle in and get ready for a fun movie night in with Sky VIP. Spend an evening with The Bad Guys, getting up to no good and promising lots of laughs",
  "Extra_Entertainment_CTA_Copy": "Claim now",
  "Extra_Entertainment_CTA_URL": "https://www.sky.com/app/tab/vip",
  "Signoff_Copy": "Make everyday a little better. It's a thank you from us.",
  "T&Cs_Hero_Link1_TEXT": "",
  "Hero_Link2_TEXT": "",
  "Hero_Link3_TEXT": "",
  "Legal_Copy": "legal legal legal legal legal legal legal legal legal legal legal legal legal legal legal legal legal legal legal legal legal legal legal legal legal legal legal legal",
  "Legal_Copy_Extra": ""
}
</script>

<template>
  <div class="p-4 min-h-full">
    <div 
      v-if="!fileOpened"
      class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 mb-6 text-center transition-colors"
      :class="{ 'border-primary-500 bg-primary-50 dark:bg-primary-900/20': isDragOver }"
      @dragenter="handleDragEnter"
      @dragleave="handleDragLeave"
      @dragover="handleDragOver"
      @drop="handleDrop"
    >
      <div class="mb-4">
        <svg class="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <p class="text-lg mb-2">Drag and drop CSV file here</p>
      <p class="text-sm text-gray-500 mb-4">or</p>
      
      <label for="file-upload" class="cursor-pointer">
        <UButton as="span">
          Choose CSV File
        </UButton>
        <input 
          id="file-upload"
          type="file" 
          accept=".csv,text/csv" 
          class="hidden"
          @change="handleFileInput"
        >
      </label>
    </div>

    <div v-if="errorMessage" class="text-center mb-6">
      <div class="inline-flex items-center px-4 py-2 rounded-lg bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
        <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        {{ errorMessage }}
      </div>
    </div>


    <div 
      v-if="csvData.length > 0" 
      class="fixed bottom-4 right-4 z-10 bg-white border border-gray-300 rounded-lg p-4 shadow-lg max-w-md overflow-y-auto"
    >
      
      <!-- Region selector -->
      <div v-if="csvData.length > 1" class="mb-4">
        <label class="block text-xs font-medium text-gray-600 mb-2">Region:</label>
        <div class="flex rounded-lg border border-gray-200 overflow-hidden">
          <button
            @click="selectedIndex = 0"
            :class="[
              'flex-1 px-4 py-2 text-sm font-medium transition-colors',
              selectedIndex === 0 
                ? 'bg-blue-500 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            ]"
          >
            UK
          </button>
          <button
            @click="selectedIndex = 1"
            :class="[
              'flex-1 px-4 py-2 text-sm font-medium transition-colors',
              selectedIndex === 1 
                ? 'bg-blue-500 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            ]"
          >
            ROI
          </button>
        </div>
      </div>

      <!-- Component visibility controls -->
      <div>
        <label class="block text-xs font-medium text-gray-600 mb-2">Pods:</label>
        <div class="space-y-3 text-xs">
          <div class="flex items-center gap-3 justify-between">
            <span>Tactical Hero</span>
            <UToggle v-model="showTacticalHero" size="xs" />
          </div>
          <div class="flex items-center gap-3 justify-between">
            <span>Sports</span>
            <UToggle v-model="showSports" size="xs" />
          </div>
          <div class="flex items-center gap-3 justify-between">
            <span>Rewards on Repeat</span>
            <UToggle v-model="showRewardsOnRepeat" size="xs" />
          </div>
          <div class="flex items-center gap-3 justify-between">
            <span>Experience</span>
            <UToggle v-model="showExperience" size="xs" />
          </div>
          <div class="flex items-center gap-3 justify-between">
            <span>Everyday Savings</span>
            <UToggle v-model="showEverydaySavings" size="xs" />
          </div>
          <div class="flex items-center gap-3 justify-between">
            <span>TV Customers</span>
            <UToggle v-model="showTvCust" size="xs" />
          </div>
          <div class="flex items-center gap-3 justify-between">
            <span>BB Customers</span>
            <UToggle v-model="showBbCust" size="xs" />
          </div>
          <div class="flex items-center gap-3 justify-between">
            <span>Mobile Customers</span>
            <UToggle v-model="showMobileCust" size="xs" />
          </div>
          <div class="flex items-center gap-3 justify-between">
            <span>TV + BB</span>
            <UToggle v-model="showTvBb" size="xs" />
          </div>
          <div class="flex items-center gap-3 justify-between">
            <span>TV + BB + Mobile</span>
            <UToggle v-model="showTvBbMobile" size="xs" />
          </div>
          <div class="flex items-center gap-3 justify-between">
            <span>TV + Mobile</span>
            <UToggle v-model="showTvMobile" size="xs" />
          </div>
          <div class="flex items-center gap-3 justify-between">
            <span>BB + Mobile</span>
            <UToggle v-model="showBbMobile" size="xs" />
          </div>
          <div class="flex items-center gap-3 justify-between">
            <span>Extra Entertainment</span>
            <UToggle v-model="showExtraEnt" size="xs" />
          </div>
        </div>
      </div>
    </div>

    <div v-if="csvData.length > 0" class="max-w-[600px] mx-auto shadow-xl text-center py-6 text-[#333] bg-white">
      
      <!-- logo -->
      <img src="https://res.newsletter.contact.sky/res/sky_ids_mid_t/e2eeab4e28f3c67efb69b0c380433eec5360ba0df24231b42c584ce7d7993566.png" alt="Sky" class="w-[100px] h-[62px] mx-auto">
      
      <!-- headline -->
      <h1 class="text-4xl leading-10 mx-12 my-6">
        {{ currentData.Main_Headline }}
      </h1>

      <!-- tactical_hero -->
      <VIPHero 
        v-if="showTacticalHero"
        :imgUrl="currentData.Tactical_Hero_Image_URL" 
        :text="currentData.Tactical_Hero_Copy"
        :ctaUrl="currentData.Tactical_Hero_CTA_URL"
        :ctaText="currentData.Tactical_Hero_CTA_Copy"
      />
      <!-- hero -->
      <VIPHero 
        v-else
        :imgUrl="currentData.Hero_Image_URL" 
        :text="currentData.Hero_Copy"
        :ctaUrl="currentData.Hero_CTA_URL"
        :ctaText="currentData.Hero_CTA_Copy"
      />

      <!-- sports - 3 col -->
      <VIPContent 
        v-if="showSports"
        :headingText="currentData.Sports_Heading"
        :imgUrl="[currentData.Sports_1_Image_URL,currentData.Sports_2_Image_URL,currentData.Sports_3_Image_URL]"
        :text="currentData.Sports_Copy"
        :ctaUrl="currentData.Sports_CTA_URL"
        :ctaText="currentData.Sports_CTA_Copy"
        type="cols"
      />
      <!-- rewards_on_repeat -->
      <VIPContent 
        v-if="showRewardsOnRepeat"
        :headingText="currentData.Rewards_on_Repeat_Heading"
        :imgUrl="currentData.Rewards_on_Repeat_Image_URL"
        :text="currentData.Rewards_on_Repeat_Copy"
        :ctaUrl="currentData.Rewards_on_Repeat_CTA_URL"
        :ctaText="currentData.Rewards_on_Repeat_CTA_Copy"
      />

      <!-- experience -->
      <VIPContent 
        v-if="showExperience"
        :headingText="currentData.Experience_Heading"
        :imgUrl="[currentData.Experience_1_Image_URL,currentData.Experience_2_Image_URL,currentData.Experience_3_Image_URL]"
        :text="currentData.Experience_Copy"
        :ctaUrl="currentData.Experience_CTA_URL"
        :ctaText="currentData.Experience_CTA_Copy"
        type="cols"
      />

      <!-- everyday_savings -->
      <VIPContent 
        v-if="showEverydaySavings"
        :headingText="currentData.Everyday_Savings_Heading"
        :imgUrl="currentData.Everyday_Savings_Image_URL"
        :text="currentData.Everyday_Savings_Copy"
        :ctaUrl="currentData.Everyday_Savings_CTA_URL"
        :ctaText="currentData.Everyday_Savings_CTA_Copy"
      />

      <!-- tv_cust -->
      <VIPContent 
        v-if="showTvCust"
        :headingText="currentData.TV_Customers_Heading"
        :imgUrl="currentData.TV_Customers_Image_URL"
        :text="currentData.TV_Customers_Copy"
        :ctaUrl="currentData.TV_Customers_CTA_URL"
        :ctaText="currentData.TV_Customers_CTA_Copy"
      />

      <!-- bb_cust -->
      <VIPContent 
        v-if="showBbCust"
        :headingText="currentData.BB_Customers_Heading"
        :imgUrl="currentData.BB_Customers_Image_URL"
        :text="currentData.BB_Customers_Copy"
        :ctaUrl="currentData.BB_Customers_CTA_URL"
        :ctaText="currentData.BB_Customers_CTA_Copy"
      />

      <!-- mobile_cust -->
      <VIPContent 
        v-if="showMobileCust"
        :headingText="currentData.Mobile_Heading"
        :imgUrl="currentData.Mobile_Image_URL"
        :text="currentData.Mobile_Copy"
        :ctaUrl="currentData.Mobile_CTA_URL"
        :ctaText="currentData.Mobile_CTA_Copy"
      />

      <!-- tv_bb -->
      <VIPContent 
        v-if="showTvBb"
        :headingText="currentData.TV_BB_Heading"
        :imgUrl="currentData.TV_BB_Image_URL"
        :text="currentData.TV_BB_Copy"
        :ctaUrl="currentData.TV_BB_CTA_URL"
        :ctaText="currentData.TV_BB_CTA_Copy"
      />

      <!-- tv_bb_mobile -->
      <VIPContent 
        v-if="showTvBbMobile"
        :headingText="currentData.TV_BB_Mobile_Heading"
        :imgUrl="currentData.TV_BB_Mobile_Image_URL"
        :text="currentData.TV_BB_Mobile_Copy"
        :ctaUrl="currentData.TV_BB_Mobile_CTA_URL"
        :ctaText="currentData.TV_BB_Mobile_CTA_Copy"
      />

      <!-- tv_mobile -->
      <VIPContent 
        v-if="showTvMobile"
        :headingText="currentData.TV_Mobile_Heading"
        :imgUrl="currentData.TV_Mobile_Image_URL"
        :text="currentData.TV_Mobile_Copy"
        :ctaUrl="currentData.TV_Mobile_CTA_URL"
        :ctaText="currentData.TV_Mobile_CTA_Copy"
      />

      <!-- bb_mobile -->
      <VIPContent 
        v-if="showBbMobile"
        :headingText="currentData.BB_Mobile_Heading"
        :imgUrl="currentData.BB_Mobile_Image_URL"
        :text="currentData.BB_Mobile_Copy"
        :ctaUrl="currentData.BB_Mobile_CTA_URL"
        :ctaText="currentData.BB_Mobile_CTA_Copy"
      />

      <!-- extra_ent -->
      <VIPContent 
        v-if="showExtraEnt"
        :headingText="currentData.Extra_Entertainment_Heading"
        :imgUrl="currentData.Extra_Entertainment_Image_URL"
        :text="currentData.Extra_Entertainment_Copy"
        :ctaUrl="currentData.Extra_Entertainment_CTA_URL"
        :ctaText="currentData.Extra_Entertainment_CTA_Copy"
      />

      <!-- signoff -->
      <VIPHeading class="mb-12">
        {{ currentData.Signoff_Copy }}
      </VIPHeading>

      <!-- footer -->
      <div class="h-[6px] gradient"></div>

      <div>
        <img src="https://res.newsletter.contact.sky/res/img/0990D9D2426E04156EA51E87F3C7235F.png" alt="Sky" class="w-[74px] h-[45px] my-10 mx-auto" />
        <p class="text-[10px] leading-[14px] mb-4 mx-7">
          <a href="#" class="underline">Privacy Policy</a> | <a href="#" class="underline">Terms and Conditions</a> | <a href="#" class="underline">Contact us</a> | <a href="#" class="underline">My Account</a>
          <br><br>
          You were sent this email as part of your Sky VIP membership.<br>
          If you do not want to continue to receive these newsletters please <a href="#" class="underline">click on this link</a>.
          <br><br>
          Please do not reply to this email as this address is not&nbsp;monitored.
          <br><br>
          {{ currentData.Legal_Copy }}
          {{ currentData.Legal_Copy_Extra }}
          <br><br>
          &#169; 2025 Sky UK Ltd. Sky UK Ltd (company no. 02906991) has its registered office at Grant Way, Isleworth, Middlesex&nbsp;TW7&nbsp;5QD.
        </p>
      </div>
    </div>
  </div>
</template>

<style>
.gradient {
  background-image: linear-gradient(to right, rgb(255, 140, 0) 5%, rgb(248, 0, 50) 25%, rgb(255, 0, 160) 45%, rgb(140, 40, 255) 65%, rgb(0, 35, 255) 82%, rgb(25, 160, 255) 96%);
}
</style>