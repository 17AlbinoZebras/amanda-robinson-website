import { buildOgImage, ogImageSize, ogImageContentType } from '../og_image'

export const alt = 'About — Amanda N. Robinson'
export const size = ogImageSize
export const contentType = ogImageContentType

export default async function Image() {
    return buildOgImage('About Me', '#FAE4B8', '#FF6B6C')
}
