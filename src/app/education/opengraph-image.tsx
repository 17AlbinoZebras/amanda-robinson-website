import { buildOgImage, ogImageSize, ogImageContentType } from '../og_image'

export const alt = 'Education — Amanda N. Robinson'
export const size = ogImageSize
export const contentType = ogImageContentType

export default async function Image() {
    return buildOgImage('Education', '#666AA3', '#FFE8BA')
}
