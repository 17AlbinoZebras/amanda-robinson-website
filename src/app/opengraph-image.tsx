import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { buildOgImage, ogImageSize, ogImageContentType } from './og_image'

export const alt = 'Amanda N. Robinson — Software Developer'
export const size = ogImageSize
export const contentType = ogImageContentType

// Only the latin (not latin-ext) woff is loaded — Satori supports ttf/otf/
// woff, but not woff2, unlike the @fontsource-based <link> the rest of the
// site uses in the browser.
const newAmsterdam = await readFile(
    join(process.cwd(), 'node_modules/@fontsource/new-amsterdam/files/new-amsterdam-latin-400-normal.woff')
)

export default async function Image() {
    return buildOgImage('Amanda Robinson', '#F6EBDE', '#5B5F97', {
        name: 'New Amsterdam',
        data: newAmsterdam,
        weight: 400,
    }, 'Software Developer')
}
