'use client'

import React, { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'

import styles from './styles/resume.module.css'
import { TintedVector } from './mask_functions'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons'

// react-pdf renders onto a <canvas> via pdf.js, which needs browser APIs
// (Worker, canvas) that don't exist during this route's static server
// prerender — ssr:false keeps that entirely client-side. Next.js only
// allows ssr:false dynamic imports inside a Client Component (hence 'use
// client' above), which does mean this whole page — not just the PDF part
// — now renders client-side instead of prerendering statically like it did
// as an <iframe>; that's the tradeoff for embedding a real PDF renderer
// instead of the browser's own native viewer.
const ResumePdfViewer = dynamic(() => import('./resume_pdf_viewer'), { ssr: false })

// 16px inset (matching .downloadButton's own corner inset) + the button's
// own 40px height — how far up from .resume's bottom edge the button's
// resting spot sits, in both the "pinned near the viewport" and "locked to
// the page" modes below.
const BUTTON_OFFSET = 56

export default function Resume() {
    // Expanded grows .resume both wider and to its full natural (auto)
    // height, so the whole resume renders at once with no inner scroll —
    // the outer PAGE scrolls instead, if it ends up taller than the
    // viewport, same as scrolling any other normal page.
    const [expanded, setExpanded] = useState(false)

    // .expandButton has two modes, switched between in JS rather than via
    // CSS position:sticky — sticky (tried twice: once as a small grid item
    // with align-self, once as a full-height "sticky window" wrapper)
    // reliably engaged in testing but never correctly released once
    // scrolled past .resume's own end in a real browser, a known rough edge
    // combining position:sticky with CSS Grid placement/alignment. This
    // reimplements the same "sticky" semantics by hand instead:
    //   - 'pinned': position:fixed, 16px from the viewport's own bottom edge
    //     — reachable throughout a .resume taller than the screen, same as
    //     before.
    //   - 'locked': once continuing to scroll would carry that pinned
    //     position PAST .resume's own bottom edge (the "wall"), the button
    //     switches to position:absolute at the exact page coordinate where
    //     contact happened and just stays there — .page (not the viewport)
    //     becomes its containing block, so from that point on it scrolls
    //     away naturally with the rest of the page like any other ordinary
    //     content, rather than continuing to be pushed around or needing a
    //     separate fade-out once you scroll past it into the footer.
    // The two modes land on the exact same screen position at the instant
    // they swap (see checkPosition below), so there's no jump — it just
    // stops being pushed any further, right where the wall reached it.
    // right is measured the same way in both modes — directly off .resume's
    // own rendered getBoundingClientRect(), not a calc() formula mirroring
    // .resume's width rules — so changing .resume/.resumeExpanded's width
    // in resume.module.css (collapsed OR expanded) never needs a matching
    // update here; whatever .resume's real right edge is, this reads it
    // straight off the DOM. .page spans the full 100vw viewport width
    // starting at its own left edge, so the same "distance from the
    // viewport's right edge" value is correct whether the button is
    // currently position:fixed (viewport-relative) or position:absolute
    // (.page-relative, once 'locked' below).
    const resumeRef = useRef<HTMLDivElement>(null)
    const [buttonPos, setButtonPos] = useState<{ mode: 'pinned'; right: number } | { mode: 'locked'; top: number; right: number }>({ mode: 'pinned', right: 16 })
    useEffect(() => {
        if (!resumeRef.current) return
        let rafId = 0
        const checkPosition = () => {
            rafId = 0
            if (!resumeRef.current) return
            const rect = resumeRef.current.getBoundingClientRect()
            const right = window.innerWidth - rect.right + 16
            // offsetTop/offsetHeight (not getBoundingClientRect) — both are
            // relative to .resume's nearest positioned ancestor (.page),
            // the SAME coordinate space .expandButton's own 'locked' mode
            // uses below, and — unlike getBoundingClientRect — don't change
            // with scroll at all, only when .resume itself actually resizes
            // (the expand/collapse toggle).
            const resumeBottomInPage = resumeRef.current.offsetTop + resumeRef.current.offsetHeight
            const lockedTop = resumeBottomInPage - BUTTON_OFFSET
            // Where the button's top would currently be, in that same
            // page-coordinate space, if it were still in 'pinned' mode.
            const pinnedTopInPage = window.scrollY + window.innerHeight - BUTTON_OFFSET
            if (pinnedTopInPage >= lockedTop) {
                setButtonPos({ mode: 'locked', top: lockedTop, right })
            } else {
                setButtonPos({ mode: 'pinned', right })
            }
        }
        const scheduleCheck = () => {
            if (rafId) return
            rafId = requestAnimationFrame(checkPosition)
        }
        checkPosition()
        window.addEventListener('scroll', scheduleCheck, { passive: true })
        window.addEventListener('resize', scheduleCheck)
        // Catches .resume's own size changing from the expand/collapse toggle
        // (a CSS class swap animated over 700ms — see .resume's transition —
        // that fires neither a window 'scroll' nor 'resize' event on its own).
        const resizeObserver = new ResizeObserver(scheduleCheck)
        resizeObserver.observe(resumeRef.current)
        return () => {
            if (rafId) cancelAnimationFrame(rafId)
            window.removeEventListener('scroll', scheduleCheck)
            window.removeEventListener('resize', scheduleCheck)
            resizeObserver.disconnect()
        }
    }, [])

    return (
        <div className={styles.page}>
            {/* maskSize is a fixed "Wpx Hpx" (not 'cover', and not just a
                single Wpx either) — 'cover' scales the pattern to always
                fill this element's own height, and that height changes a
                lot when .resumeExpanded (below) grows the whole page
                taller, which read as the background visibly "zooming" in
                sync with the resume box's own expand animation. A single
                width value alone wasn't quite enough to fully fix that: the
                implied second-axis "auto" (deriving height from the mask's
                own intrinsic ratio) isn't consistently honored for
                mask-image across browsers the way it is for a real
                background-image, so height could still end up tracking the
                container somewhat. Writing both axes explicitly (1200px, by
                1200 * 306.02/612.01 — Red-Squiggles.svg's own NATURAL_SIZE
                ratio in mask_functions.tsx) removes that ambiguity outright
                — both dimensions are now fixed regardless of the page's own
                height, and repeat still tiles the resulting constant-size
                tile to cover whatever height is actually needed. */}
            <TintedVector src="/masks/Red-Squiggles.svg" color='#B4CAC1' width='100vw' height='100vh' repeat maskSize="1200px 600px" className={styles.resumeBackground}/>
            <header>
                <h1 className={styles.heading}>Resume</h1>
            </header>
            <div ref={resumeRef} className={`${styles.resume} ${expanded ? styles.resumeExpanded : ''}`}>
                <a className={styles.downloadButton} href='https://docs.google.com/document/d/1-O_EsqOcbVnY0tlRIP4p0EGaKX2AzlZMeZXaj3E4uS4/export?format=pdf' aria-label="Download resume as PDF">< FontAwesomeIcon icon={fas.faDownload} aria-hidden="true" /></a>
                <ResumePdfViewer/>
            </div>
            <button
                className={styles.expandButton}
                style={buttonPos.mode === 'locked'
                    ? { position: 'absolute', top: `${buttonPos.top}px`, right: `${buttonPos.right}px` }
                    : { position: 'fixed', bottom: '12px', right: `${buttonPos.right}px` }}
                onClick={() => setExpanded((e) => !e)}
                aria-label={expanded ? 'Shrink resume' : 'Expand resume'}
                aria-pressed={expanded}
            >
                <FontAwesomeIcon icon={expanded ? fas.faCompress : fas.faExpand} aria-hidden="true" />
            </button>
        </div>
    )
}
