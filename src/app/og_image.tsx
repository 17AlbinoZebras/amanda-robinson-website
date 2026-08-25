import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'

export const ogImageSize = { width: 1200, height: 630 }
export const ogImageContentType = 'image/png'

// Satori (which renders these) can't load @fontsource packages directly —
// only a raw font file buffer, passed in explicitly via ImageResponse's
// `fonts` option, and only in ttf/otf/woff (not woff2, unlike the
// @fontsource-variable/afacad-flux <link> the rest of the site uses in the
// browser) — hence the separate, non-variable @fontsource/afacad-flux
// dependency this reads from instead. Loaded once here, shared by every
// page's card as the subtitle's font, since it doesn't vary per page the
// way the title's does.
const afacadFlux = await readFile(
    join(process.cwd(), 'node_modules/@fontsource/afacad-flux/files/afacad-flux-latin-500-normal.woff')
)
const AFACAD_FLUX_NAME = 'Afacad Flux'

type TitleFont = { name: string; data: Buffer | ArrayBuffer; weight: 400 | 500 | 600 | 700 }

// titleFont is each caller's own page-heading font (New Amsterdam or
// Idiqlat — see each route's opengraph-image.tsx); the subtitle always
// renders in the shared Afacad Flux above, matching how the real pages
// pair a themed heading font with Afacad Flux for everything else.
// subtitle defaults to the byline every page but Home uses — Home swaps
// the two (title "Amanda Robinson", subtitle "Software Developer") since
// its title is otherwise the only one not actually naming the page.
export function buildOgImage(title: string, background: string, textColor: string, titleFont: TitleFont, subtitle: string = 'Amanda N. Robinson') {
    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: background,
                }}
            >
                <div
                    style={{
                        fontSize: 96,
                        fontWeight: titleFont.weight,
                        fontFamily: titleFont.name,
                        color: textColor,
                        textAlign: 'center',
                        padding: '0 60px',
                        lineHeight: 1.1,
                    }}
                >
                    {title}
                </div>
                <div
                    style={{
                        fontSize: 36,
                        fontWeight: 500,
                        fontFamily: AFACAD_FLUX_NAME,
                        color: textColor,
                        opacity: 0.85,
                        marginTop: 28,
                    }}
                >
                    {subtitle}
                </div>
            </div>
        ),
        {
            ...ogImageSize,
            fonts: [
                { name: titleFont.name, data: titleFont.data, style: 'normal', weight: titleFont.weight },
                { name: AFACAD_FLUX_NAME, data: afacadFlux, style: 'normal', weight: 500 },
            ],
        }
    )
}
