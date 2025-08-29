<script setup lang="ts">
useHead({
  title: 'Vibgrab'
})
definePageMeta({
  name: 'Vibgrab'
})

interface ProcessedFile {
  file: File
  identifier: string
  browserViewUrl: string
  finalUrl: string
  isLoadingRedirect: boolean
}

const emlFiles = ref<File[]>([])
const processedFiles = ref<ProcessedFile[]>([])
const fileOpened = ref(false)
const errorMessage = ref('')
const isDragOver = ref(false)
const isProcessing = ref(false)

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

  processFiles(files).catch(err => {
    console.error('Error processing files:', err)
    errorMessage.value = 'Error processing files'
  })
}

async function handleFileInput(e: Event) {
  const target = e.target as HTMLInputElement
  const files = Array.from(target.files || [])
  
  if (files.length === 0) {
    return
  }

  processFiles(files).catch(err => {
    console.error('Error processing files:', err)
    errorMessage.value = 'Error processing files'
  })
}

async function processFiles(files: File[]) {
  errorMessage.value = ''
  isProcessing.value = true
  
  const validFiles: File[] = []
  
  for (const file of files) {
    const fileExtension = file.name.split('.').pop()?.toLowerCase()
    const isEML = fileExtension === 'eml'
    
    if (!isEML) {
      errorMessage.value = `Error: ${file.name} is not a .eml file. Please select .eml files only.`
      continue
    }
    
    validFiles.push(file)
  }

  if (validFiles.length === 0) {
    fileOpened.value = false
    emlFiles.value = []
    processedFiles.value = []
    isProcessing.value = false
    return
  }

  try {
    emlFiles.value = validFiles
    const processed: ProcessedFile[] = []
    
    // First pass: extract file info and URLs immediately
    for (const file of validFiles) {
      const identifier = extractIdentifier(file.name)
      const browserViewUrl = await extractBrowserViewUrl(file)
      
      processed.push({
        file,
        identifier,
        browserViewUrl,
        finalUrl: '',
        isLoadingRedirect: browserViewUrl ? true : false
      })
    }
    
    // Show the files immediately
    processedFiles.value = processed
    fileOpened.value = true
    
    // Second pass: resolve redirects asynchronously
    for (let i = 0; i < processed.length; i++) {
      const processedFile = processed[i]
      if (processedFile && processedFile.browserViewUrl) {
        // Start redirect resolution in background
        followRedirect(processedFile.browserViewUrl).then((finalUrl: string) => {
          // Update the specific file's redirect info
          const targetFile = processedFiles.value[i]
          if (targetFile) {
            targetFile.finalUrl = finalUrl
            targetFile.isLoadingRedirect = false
          }
        }).catch((error: unknown) => {
          console.error('Error resolving redirect:', error)
          const targetFile = processedFiles.value[i]
          if (targetFile && processedFile) {
            targetFile.finalUrl = processedFile.browserViewUrl // Fallback to original
            targetFile.isLoadingRedirect = false
          }
        })
      }
    }
  } catch (error: unknown) {
    console.error('Error processing files:', error)
    errorMessage.value = 'Error: Failed to process .eml files'
    fileOpened.value = false
    emlFiles.value = []
    processedFiles.value = []
  } finally {
    isProcessing.value = false
  }
}

function extractIdentifier(filename: string): string {
  const firstBracket = filename.indexOf('[')
  if (firstBracket === -1) return ''
  
  const beforeMultipart = filename.indexOf(' 1 multipart')
  if (beforeMultipart === -1) return ''
  
  return filename.substring(firstBracket + 1, beforeMultipart)
}

async function extractBrowserViewUrl(file: File): Promise<string> {
  try {
    const text = await file.text()
    
    // Try different patterns to find the HTML part of the email
    let htmlMatch = text.match(/Content-Type:\s*text\/html[\s\S]*?\n\n([\s\S]*?)(?=\n--|\n\r\n--|\r\n--|\Z)/i)
    
    // Alternative pattern for different email structures
    if (!htmlMatch) {
      htmlMatch = text.match(/Content-Type:\s*text\/html[\s\S]*?\n\r?\n([\s\S]*?)(?=--|\Z)/i)
    }
    
    // Even more flexible pattern
    if (!htmlMatch) {
      htmlMatch = text.match(/text\/html[\s\S]*?\n\r?\n([\s\S]*?)(?=--|\Z)/i)
    }
    
    // Look for any HTML-like content
    if (!htmlMatch) {
      const hasHtmlTags = /<html|<body|<table|<div|<a\s+href/i.test(text)
      
      if (hasHtmlTags) {
        // Find the section that contains HTML
        const htmlSectionMatch = text.match(/([\s\S]*?<[\s\S]*>[\s\S]*)/i)
        if (htmlSectionMatch && htmlSectionMatch[1]) {
          htmlMatch = [text, htmlSectionMatch[1]]
        }
      }
    }
    
    if (!htmlMatch || !htmlMatch[1]) {
      return ''
    }
    
    let htmlContent = htmlMatch[1]
    
    // Always decode quoted-printable since it might be present even without explicit header
    htmlContent = decodeQuotedPrintable(htmlContent)
    
    // Look for "view email in browser" link specifically in the footer structure
    // Target: <td style="padding-top: 15px;"> ... <p> ... <a href="...">View email in browser</a>
    const specificStructureRegex = /<td[^>]*padding-top:\s*15px[^>]*>[\s\S]*?<p[^>]*>[\s\S]*?<a[^>]*href\s*=\s*["']([^"']*?)["'][^>]*>[\s\S]*?view\s+email\s+in\s+browser[\s\S]*?<\/a>/gi
    const specificMatch = specificStructureRegex.exec(htmlContent)
    
    if (specificMatch && specificMatch[1]) {
      let url = specificMatch[1]
      url = url.replace(/=3D/g, '=').replace(/=\r?\n/g, '')
      return url
    }
    
    // Fallback: Look for "view email in browser" link (case insensitive) but more specific
    const linkRegex = /<a[^>]*href\s*=\s*["']([^"']*?)["'][^>]*>[\s\S]*?view\s+email\s+in\s+browser[\s\S]*?<\/a>/gi
    const match = linkRegex.exec(htmlContent)
    
    if (match && match[1]) {
      // Clean up any remaining encoded characters in the URL
      let url = match[1]
      // Handle any remaining encoded characters that might be in URLs
      url = url.replace(/=3D/g, '=').replace(/=\r?\n/g, '')
      return url
    }
    
    // Another fallback: try to find any link that contains the text even if regex fails
    const simpleMatch = htmlContent.match(/href\s*=\s*["']([^"']*?)["'][^>]*>[\s\S]*?view\s+email\s+in\s+browser/gi)
    
    if (simpleMatch) {
      const urlMatch = simpleMatch[0].match(/href\s*=\s*["']([^"']*?)["']/i)
      if (urlMatch && urlMatch[1]) {
        let url = urlMatch[1]
        url = url.replace(/=3D/g, '=').replace(/=\r?\n/g, '')
        return url
      }
    }
    
    // Last resort: search the entire email text for the link
    const fullTextHasView = /view\s+email\s+in\s+browser/gi.test(text)
    
    if (fullTextHasView) {
      const fullTextDecoded = decodeQuotedPrintable(text)
      
      // Try to find the link in the full decoded text using the specific structure first
      const fullTextSpecificRegex = /<td[^>]*padding-top:\s*15px[^>]*>[\s\S]*?<p[^>]*>[\s\S]*?<a[^>]*href\s*=\s*["']([^"']*?)["'][^>]*>[\s\S]*?view\s+email\s+in\s+browser[\s\S]*?<\/a>/gi
      let fullTextMatch = fullTextSpecificRegex.exec(fullTextDecoded)
      
      // If specific structure not found, try general approach
      if (!fullTextMatch) {
        const fullTextLinkRegex = /<a[^>]*href\s*=\s*["']([^"']*?)["'][^>]*>[\s\S]*?view\s+email\s+in\s+browser[\s\S]*?<\/a>/gi
        fullTextMatch = fullTextLinkRegex.exec(fullTextDecoded)
      }
      
      if (fullTextMatch && fullTextMatch[1]) {
        let url = fullTextMatch[1]
        url = url.replace(/=3D/g, '=').replace(/=\r?\n/g, '')
        return url
      }
    }
    
    return ''
  } catch (error: unknown) {
    console.error('💥 Error extracting browser view URL:', error)
    return ''
  }
}

function decodeQuotedPrintable(text: string): string {
  return text
    .replace(/=\r?\n/g, '') // Remove soft line breaks
    .replace(/=([0-9A-F]{2})/gi, (match, hex) => {
      return String.fromCharCode(parseInt(hex, 16))
    })
}

async function followRedirect(url: string): Promise<string> {
  try {
    // Call serverless function to handle redirect following
    const response = await $fetch<{ finalUrl?: string }>('/api/vibRedirect', {
      method: 'POST',
      body: { url }
    })
    
    return response.finalUrl || url
    
  } catch (error: unknown) {
    console.error('Error following redirect:', error)
    return url // Return original URL if redirect fails
  }
}

const { copy } = useClipboard()
const copyBtnText = ref('Copy All')

function copyAllResults() {
  const results = processedFiles.value
    .filter(file => file.identifier || file.finalUrl)
    .map(file => `${file.identifier || 'N/A'}\n${file.finalUrl || file.browserViewUrl || 'N/A'}`)
    .join('\n\n')
  
  copy(results)
  copyBtnText.value = 'Copied!'
  
  setTimeout(() => {
    copyBtnText.value = 'Copy All'
  }, 2000)
}

function clearAll() {
  emlFiles.value = []
  processedFiles.value = []
  fileOpened.value = false
  errorMessage.value = ''
}

</script>

<template>
  <div class="p-4 min-h-full">
    <div class="mb-6">
      <div class="flex justify-center gap-4 mb-4">
        <UButton @click="clearAll" :disabled="!fileOpened">
          Clear All
        </UButton>
      </div>
    </div>

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
      <p class="text-lg mb-2">Drag and drop .eml files here</p>
      <p class="text-sm text-gray-500 mb-4">or</p>
      
      <label for="file-upload" class="cursor-pointer">
        <UButton as="span">
          Choose .eml Files
        </UButton>
        <input 
          id="file-upload"
          type="file" 
          accept=".eml" 
          multiple
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

    <div v-if="isProcessing" class="text-center py-8">
      <div class="inline-flex items-center px-4 py-2 rounded-lg bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Processing email files...
      </div>
    </div>

    <div v-if="processedFiles.length > 0" class="space-y-6">
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-semibold">Results ({{ processedFiles.length }})</h2>
        <UButton @click="copyAllResults">
          {{ copyBtnText }}
        </UButton>
      </div>
      
      <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <div v-for="(processedFile, index) in processedFiles" :key="index" class="mb-4 last:mb-0">
          <div class="font-mono text-sm space-y-1">
            <div>{{ processedFile.identifier || 'N/A' }}</div>
            <div v-if="processedFile.isLoadingRedirect" class="text-gray-500 italic">
              Getting vib...
            </div>
            <div v-else class="break-all">
              {{ processedFile.finalUrl || processedFile.browserViewUrl || 'N/A' }}
            </div>
          </div>
          <div v-if="index < processedFiles.length - 1" class="border-b border-gray-200 dark:border-gray-600 mt-4"></div>
        </div>
      </div>
    </div>
  </div>
</template>