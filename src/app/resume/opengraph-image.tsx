import { buildOgImage, ogImageSize, ogImageContentType } from '../og_image'

export const alt = 'Resume — Amanda N. Robinson'
export const size = ogImageSize
export const contentType = ogImageContentType

export default async function Image() {
    return buildOgImage('Resume', '#B4CAC1', '#5B5F97')
}
