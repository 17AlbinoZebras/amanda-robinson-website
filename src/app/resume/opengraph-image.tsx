import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { buildOgImage, ogImageSize, ogImageContentType } from '../og_image'

export const alt = 'Resume — Amanda N. Robinson'
export const size = ogImageSize
export const contentType = ogImageContentType

// Matches resume.module.css's .heading, which is set in Idiqlat.
const idiqlat = await readFile(
    join(process.cwd(), 'node_modules/@fontsource/idiqlat/files/idiqlat-latin-400-normal.woff')
)

export default async function Image() {
    return buildOgImage('Resume', '#B4CAC1', '#5B5F97', {
        name: 'Idiqlat',
        data: idiqlat,
        weight: 400,
    })
}
