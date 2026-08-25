import { buildOgImage, ogImageSize, ogImageContentType } from './og_image'

export const alt = 'Amanda N. Robinson — Software Developer'
export const size = ogImageSize
export const contentType = ogImageContentType

export default async function Image() {
    return buildOgImage('Software Developer', '#F6EBDE', '#5B5F97')
}
