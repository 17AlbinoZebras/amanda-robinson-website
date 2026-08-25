import { buildOgImage, ogImageSize, ogImageContentType } from '../og_image'

export const alt = 'Projects — Amanda N. Robinson'
export const size = ogImageSize
export const contentType = ogImageContentType

export default async function Image() {
    return buildOgImage('Projects', '#FDC5C4', '#5B5F97')
}
