import { buildOgImage, ogImageSize, ogImageContentType } from '../og_image'

export const alt = 'Work Experience — Amanda N. Robinson'
export const size = ogImageSize
export const contentType = ogImageContentType

export default async function Image() {
    return buildOgImage('Work Experience', '#78A693', '#FFFFFB')
}
