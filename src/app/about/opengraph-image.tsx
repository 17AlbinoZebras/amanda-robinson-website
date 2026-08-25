import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { buildOgImage, ogImageSize, ogImageContentType } from '../og_image'

export const alt = 'About — Amanda N. Robinson'
export const size = ogImageSize
export const contentType = ogImageContentType

// Matches about.module.css's .heading, which is set in Idiqlat.
const idiqlat = await readFile(
    join(process.cwd(), 'node_modules/@fontsource/idiqlat/files/idiqlat-latin-400-normal.woff')
)

export default async function Image() {
    return buildOgImage('About Me', '#FAE4B8', '#FF6B6C', {
        name: 'Idiqlat',
        data: idiqlat,
        weight: 400,
    })
}
