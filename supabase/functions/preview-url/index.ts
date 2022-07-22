import { supabaseClient } from '../supabase_client.ts'
import { ServerError } from '../server_error.ts'
import { classicServe } from '../utils.ts'

classicServe(async (request: Request) => {
  const { url } = await request.json()

  if (!url) {
    throw new ServerError(400, 'url is required')
  }

  // First we request the page to preview and get the HTML
  const response = await fetch(url)
  const html = await response.text()

  // Then we extract all the meta tags from the and get their content
  const metaTags = html.matchAll(/<meta[^>]*>/gi)

  // We look for tags with og data
  const ogTags = Array.from(metaTags).filter(tag => /property="og:.*"/gi.test(tag[0]) && /content=".*"/gi.test(tag[0]))

  // We extract the content of the og tags
  const ogData = ogTags.map(tag => {
    const property = tag[0].match(/property="([^"]*)"/i)
    const content = tag[0].match(/content="([^"]*)"/i)

    if (property && content) {
      return {
        property: property[1],
        content: content[1]
      }
    }
  }).filter(tag => tag != undefined)

  // We look for the title, the description and the image
  const title = ogData.find(tag => tag!.property === 'og:title')?.content
  const description = ogData.find(tag => tag!.property === 'og:description')?.content
  const image = ogData.find(tag => tag!.property === 'og:image')?.content

  return {
    title: title || '',
    description: description || '',
    image: image || ''
  }
})
