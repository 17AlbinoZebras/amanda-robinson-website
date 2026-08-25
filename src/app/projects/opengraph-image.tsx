import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { buildOgImage, ogImageSize, ogImageContentType } from '../og_image'

export const alt = 'Projects — Amanda N. Robinson'
export const size = ogImageSize
export const contentType = ogImageContentType

// Matches projects.module.css's .heading, which is set in New Amsterdam.
const newAmsterdam = await readFile(
    join(process.cwd(), 'node_modules/@fontsource/new-amsterdam/files/new-amsterdam-latin-400-normal.woff')
)

export default async function Image() {
    return buildOgImage('Projects', '#FDC5C4', '#5B5F97', {
        name: 'New Amsterdam',
        data: newAmsterdam,
        weight: 400,
    })
}
