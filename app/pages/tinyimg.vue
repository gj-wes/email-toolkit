<script setup lang="ts">
import imageCompression from 'browser-image-compression'
import JSZip from 'jszip'

useHead({
  title: 'TinyImg - Image Compressor'
})

definePageMeta({
  name: 'TinyImg'
})

interface CompressedImage {
  id: string
  originalFile: File
  compressedFile: File | null
  originalSize: number
  compressedSize: number
  compressionRatio: number
  status: 'pending' | 'compressing' | 'completed' | 'error'
  error?: string
}

const images = ref<CompressedImage[]>([])
const isDragOver = ref(false)
const isProcessing = ref(false)
const compressionOptions = ref({
  maxSizeMB: 0.5,
  maxWidthOrHeight: 1200,
  useWebWorker: true,
  quality: 0.7,
  initialQuality: 0.7,
  alwaysKeepResolution: false
})

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
  const imageFiles = files.filter(file => file.type.startsWith('image/'))
  
  if (imageFiles.length === 0) {
    return
  }

  await processImages(imageFiles)
}

async function handleFileInput(e: Event) {
  const target = e.target as HTMLInputElement
  const files = Array.from(target.files || [])
  
  if (files.length === 0) {
    return
  }

  await processImages(files)
}

async function processImages(files: File[]) {
  isProcessing.value = true
  
  const newImages: CompressedImage[] = files.map(file => ({
    id: crypto.randomUUID(),
    originalFile: file,
    compressedFile: null,
    originalSize: file.size,
    compressedSize: 0,
    compressionRatio: 0,
    status: 'pending'
  }))

  images.value.push(...newImages)

  for (const image of newImages) {
    image.status = 'compressing'
    
    try {
      const compressedFile = await imageCompression(image.originalFile, compressionOptions.value)
      
      image.compressedFile = compressedFile
      image.compressedSize = compressedFile.size
      image.compressionRatio = Math.round(((image.originalSize - compressedFile.size) / image.originalSize) * 100)
      image.status = 'completed'
    } catch (error) {
      image.status = 'error'
      image.error = error instanceof Error ? error.message : 'Compression failed'
    }
  }
  
  isProcessing.value = false
}

function downloadImage(image: CompressedImage) {
  if (!image.compressedFile) return
  
  const url = URL.createObjectURL(image.compressedFile)
  const a = document.createElement('a')
  a.href = url
  a.download = `compressed_${image.originalFile.name}`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

async function downloadAll() {
  const completedImages = images.value.filter(img => img.status === 'completed' && img.compressedFile)
  
  if (completedImages.length === 0) return
  
  const zip = new JSZip()
  
  for (const image of completedImages) {
    if (image.compressedFile) {
      zip.file(`compressed_${image.originalFile.name}`, image.compressedFile)
    }
  }
  
  const content = await zip.generateAsync({ type: 'blob' })
  const url = URL.createObjectURL(content)
  const a = document.createElement('a')
  a.href = url
  a.download = 'compressed_images.zip'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function clearAll() {
  images.value = []
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function removeImage(imageId: string) {
  images.value = images.value.filter(img => img.id !== imageId)
}
</script>

<template>
  <div class="p-4 min-h-full">
    <!-- Header and Controls -->
    <div class="mb-6">
      <div class="flex justify-center gap-4 mb-4">
        <UButton @click="clearAll" :disabled="images.length === 0">
          Clear All
        </UButton>
        <UButton 
          @click="downloadAll" 
          :disabled="!images.some(img => img.status === 'completed')"
          color="primary"
        >
          Download All as ZIP
        </UButton>
      </div>

      <!-- Compression Settings -->
      <div class="flex justify-center gap-6 mb-4 text-sm">
        <label class="flex items-center">
          Quality:
          <input 
            v-model.number="compressionOptions.quality" 
            type="number" 
            min="0.1" 
            max="1" 
            step="0.1"
            class="ml-2 w-16 px-2 py-1 border rounded dark:bg-gray-800 dark:border-gray-600"
          >
        </label>
      </div>
    </div>

    <!-- Drop Zone -->
    <div 
      class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 mb-6 text-center transition-colors"
      :class="{ 'border-primary-500 bg-primary-50 dark:bg-primary-900/20': isDragOver }"
      @dragenter="handleDragEnter"
      @dragleave="handleDragLeave"
      @dragover="handleDragOver"
      @drop="handleDrop"
    >
      <div class="mb-4">
        <svg class="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <p class="text-lg mb-2">Drag and drop images here</p>
      <p class="text-sm text-gray-500 mb-4">or</p>
      
      <label for="file-upload" class="cursor-pointer">
        <UButton as="span">
          Choose Files
        </UButton>
        <input 
          id="file-upload"
          type="file" 
          multiple 
          accept="image/*" 
          class="hidden"
          @change="handleFileInput"
        >
      </label>
    </div>

    <!-- Processing Indicator -->
    <div v-if="isProcessing" class="text-center mb-6">
      <div class="inline-flex items-center">
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Processing images...
      </div>
    </div>

    <!-- Images List -->
    <div v-if="images.length > 0" class="space-y-4">
      <div 
        v-for="image in images" 
        :key="image.id"
        class="border rounded-lg p-4 dark:border-gray-600"
      >
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <div class="font-medium">{{ image.originalFile.name }}</div>
            <div class="text-sm text-gray-500">
              {{ formatFileSize(image.originalSize) }}
              <span v-if="image.status === 'completed'">
                → {{ formatFileSize(image.compressedSize) }}
                <span class="text-green-600 font-medium">({{ image.compressionRatio }}% smaller)</span>
              </span>
            </div>
            
            <!-- Status -->
            <div class="mt-2">
              <span 
                v-if="image.status === 'pending'" 
                class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
              >
                Pending
              </span>
              <span 
                v-else-if="image.status === 'compressing'" 
                class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
              >
                <svg class="animate-spin -ml-1 mr-1 h-3 w-3" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Compressing
              </span>
              <span 
                v-else-if="image.status === 'completed'" 
                class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
              >
                Completed
              </span>
              <span 
                v-else-if="image.status === 'error'" 
                class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                :title="image.error"
              >
                Error
              </span>
            </div>
          </div>
          
          <div class="flex gap-2">
            <UButton 
              v-if="image.status === 'completed'"
              @click="downloadImage(image)"
              size="sm"
              color="primary"
            >
              Download
            </UButton>
            <UButton 
              @click="removeImage(image.id)"
              size="sm"
              color="red"
              variant="ghost"
            >
              Remove
            </UButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom styles for better drag and drop visual feedback */
</style>