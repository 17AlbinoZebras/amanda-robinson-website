import { ImageResponse } from 'next/og'

export const ogImageSize = { width: 1200, height: 630 }
export const ogImageContentType = 'image/png'

// Shared by every route's opengraph-image.tsx (see e.g. about/opengraph-image.tsx)
// so each page's card only has to supply its own title + colors, not
// reimplement the whole layout. Uses generic system fonts rather than the
// site's own (Idiqlat/New Amsterdam/Afacad Flux) — Satori (which renders
// these) can't load @fontsource packages directly, only raw font file
// buffers passed in explicitly, and a close-enough bold sans-serif is a
// reasonable tradeoff for a social-preview card versus that complexity.
export function buildOgImage(title: string, background: string, textColor: string) {
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
                    fontFamily: 'sans-serif',
                }}
            >
                <div
                    style={{
                        fontSize: 96,
                        fontWeight: 700,
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
                        color: textColor,
                        opacity: 0.85,
                        marginTop: 28,
                    }}
                >
                    Amanda N. Robinson
                </div>
            </div>
        ),
        { ...ogImageSize }
    )
}
