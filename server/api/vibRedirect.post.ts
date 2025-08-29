export default defineEventHandler(async (event) => {
  const { url } = await readBody(event)

  try {
    const response = await fetch(url, {
      method: 'GET',
    })
    
    return { finalUrl: response.url }
  } catch (error) {
    console.error('Error following redirect:', error)
    return { finalUrl: url }
  }
})