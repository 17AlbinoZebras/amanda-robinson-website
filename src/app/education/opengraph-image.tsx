import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { buildOgImage, ogImageSize, ogImageContentType } from '../og_image'

export const alt = 'Education — Amanda N. Robinson'
export const size = ogImageSize
export const contentType = ogImageContentType

// Matches education.module.css's .heading, which is set in New Amsterdam.
const newAmsterdam = await readFile(
    join(process.cwd(), 'node_modules/@fontsource/new-amsterdam/files/new-amsterdam-latin-400-normal.woff')
)

export default async function Image() {
    return buildOgImage('Education', '#666AA3', '#FFE8BA', {
        name: 'New Amsterdam',
        data: newAmsterdam,
        weight: 400,
    })
}
