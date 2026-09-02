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

const MAX_ZOOM = 3

type GestureState =
    | { mode: 'none' }
    | { mode: 'pinch'; startDist: number; startScale: number; startOffset: { x: number; y: number } }
    | { mode: 'pan'; startTouch: { x: number; y: number }; startOffset: { x: number; y: number } }

function touchDistance(t1: React.Touch, t2: React.Touch) {
    return Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY)
}

// Keeps panning bounded to how far the zoomed content actually overflows its
// own frame — at scale 1 that's 0 either way (no zoom, nothing to pan), and
// it grows with scale so a bigger zoom allows a proportionally bigger pan.
function clampOffset(scale: number, offset: { x: number; y: number }, rect: DOMRect) {
    const maxX = (rect.width * (scale - 1)) / 2
    const maxY = (rect.height * (scale - 1)) / 2
    return {
        x: Math.min(maxX, Math.max(-maxX, offset.x)),
        y: Math.min(maxY, Math.max(-maxY, offset.y)),
    }
}

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

    // Pinch-to-zoom + drag-to-pan, scoped to the PDF itself (.pdfZoomWrapper
    // below) rather than the page — .resume's own overflow:hidden clips the
    // zoomed/panned content to its normal frame, and .resume's own
    // width/height never change here, so the rest of the page stays exactly
    // where it was regardless of zoom. This replaces the expand button as
    // the mobile way to see more detail (that button is hidden on mobile —
    // see resume.module.css), and works alongside the desktop expand toggle
    // without conflict (nothing here reacts to mouse input at all, only
    // touch, so desktop is unaffected).
    const pdfWrapperRef = useRef<HTMLDivElement>(null)
    const [zoomScale, setZoomScale] = useState(1)
    const [zoomOffset, setZoomOffset] = useState({ x: 0, y: 0 })
    const [isGesturing, setIsGesturing] = useState(false)
    const gestureRef = useRef<GestureState>({ mode: 'none' })

    // A single finger only ever pans (never scrolls the page underneath) once
    // already zoomed in — at scale 1 there's nothing to pan, so a lone touch
    // is left alone entirely and the frame's own native scroll (see
    // .pdfContainer in resume.module.css) still handles it normally.
    const handleTouchStart = (e: React.TouchEvent) => {
        if (!pdfWrapperRef.current) return
        if (e.touches.length === 2) {
            setIsGesturing(true)
            gestureRef.current = {
                mode: 'pinch',
                startDist: touchDistance(e.touches[0], e.touches[1]),
                startScale: zoomScale,
                startOffset: zoomOffset,
            }
        } else if (e.touches.length === 1 && zoomScale > 1) {
            setIsGesturing(true)
            gestureRef.current = {
                mode: 'pan',
                startTouch: { x: e.touches[0].clientX, y: e.touches[0].clientY },
                startOffset: zoomOffset,
            }
        } else {
            gestureRef.current = { mode: 'none' }
        }
    }

    const handleTouchMove = (e: React.TouchEvent) => {
        const g = gestureRef.current
        if (!pdfWrapperRef.current || g.mode === 'none') return
        const rect = pdfWrapperRef.current.getBoundingClientRect()
        if (g.mode === 'pinch' && e.touches.length === 2) {
            // Only claims the gesture once it's genuinely a pinch (2 touches) —
            // never preventDefault on a plain single-finger scroll.
            e.preventDefault()
            const dist = touchDistance(e.touches[0], e.touches[1])
            const newScale = Math.min(MAX_ZOOM, Math.max(1, g.startScale * (dist / g.startDist)))
            setZoomScale(newScale)
            setZoomOffset(clampOffset(newScale, g.startOffset, rect))
        } else if (g.mode === 'pan' && e.touches.length === 1) {
            e.preventDefault()
            const dx = e.touches[0].clientX - g.startTouch.x
            const dy = e.touches[0].clientY - g.startTouch.y
            setZoomOffset(clampOffset(zoomScale, { x: g.startOffset.x + dx, y: g.startOffset.y + dy }, rect))
        }
    }

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (e.touches.length === 2) {
            // Still mid-pinch (e.g. one of 3+ touches lifted) — nothing to do.
            return
        }
        if (e.touches.length === 1 && gestureRef.current.mode === 'pinch') {
            // Pinch handed off to a single remaining finger — keep going as a
            // pan instead of dropping the gesture entirely.
            gestureRef.current = {
                mode: 'pan',
                startTouch: { x: e.touches[0].clientX, y: e.touches[0].clientY },
                startOffset: zoomOffset,
            }
            return
        }
        gestureRef.current = { mode: 'none' }
        setIsGesturing(false)
        // Snaps fully back to 1 rather than leaving it sitting at, say, 1.01
        // from an imprecise pinch release — 1 reads as "not zoomed" and lets
        // the frame's native scroll take back over cleanly.
        if (zoomScale <= 1.02) {
            setZoomScale(1)
            setZoomOffset({ x: 0, y: 0 })
        }
    }

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
            <TintedVector src="/masks/Red-Squiggles.svg" color='#c7d6d1' width='100vw' height='100vh' repeat maskSize="1200px 600px" className={styles.resumeBackground}/>
            <header>
                <h1 className={styles.heading}>Resume</h1>
            </header>
            <div ref={resumeRef} className={`${styles.resume} ${expanded ? styles.resumeExpanded : ''}`}>
                <a className={styles.downloadButton} href='https://docs.google.com/document/d/1-O_EsqOcbVnY0tlRIP4p0EGaKX2AzlZMeZXaj3E4uS4/export?format=pdf' aria-label="Download resume as PDF">< FontAwesomeIcon icon={fas.faDownload} aria-hidden="true" /></a>
                <div
                    ref={pdfWrapperRef}
                    className={styles.pdfZoomWrapper}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onTouchCancel={handleTouchEnd}
                    style={{
                        transform: `translate(${zoomOffset.x}px, ${zoomOffset.y}px) scale(${zoomScale})`,
                        transition: isGesturing ? 'none' : 'transform 200ms ease',
                    }}
                >
                    <ResumePdfViewer/>
                </div>
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
