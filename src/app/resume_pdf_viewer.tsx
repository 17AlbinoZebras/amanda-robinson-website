'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'

import styles from './styles/resume.module.css'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString()

export default function ResumePdfViewer() {
    const containerRef = useRef<HTMLDivElement>(null)
    const [pageWidth, setPageWidth] = useState(0)
    const [numPages, setNumPages] = useState(0)

    useEffect(() => {
        if (!containerRef.current) return
        const measure = () => {
            if (!containerRef.current) return
            // Width-only (not also height-constrained) — .pdfContainer below
            // scrolls vertically now, so pages render at the full box width
            // and simply stack taller than the box when there's more than
            // one, instead of everything having to be shrunk to fit a
            // single fixed-height view. No border to subtract here anymore
            // — it's on .resume (the fixed frame around this scrolling
            // container), not inside it, so clientWidth is already the full
            // space pages can use.
            setPageWidth(containerRef.current.clientWidth)
        }
        // Measured once synchronously up front — ResizeObserver is supposed
        // to guarantee an initial callback as soon as .observe() is called
        // (reporting the element's current size even before anything
        // actually changes), but that didn't hold up reliably in testing,
        // leaving pageWidth stuck at 0 and the whole PDF never mounting at
        // all. This direct call is the same safety net the previous
        // window-'resize' version had (it also measured once immediately
        // before ever relying on the 'resize' event), just restated here so
        // first render doesn't depend on the observer firing at all.
        measure()
        // ResizeObserver (not a window 'resize' listener) — this container's
        // width also changes from resume.tsx's expand/collapse toggle, which
        // resizes .resume via a CSS class swap and fires no 'resize' event
        // at all (that only fires for the actual browser viewport). A
        // ResizeObserver reacts to the element's own rendered size changing
        // for any reason, covering both cases with one mechanism.
        // Settle-debounced (150ms after the last callback, not per-frame) —
        // .resume animates its width/height on the expand toggle, so this
        // fires continuously for the whole transition; re-rendering the PDF
        // canvas on every intermediate frame would be wasted, janky work.
        // Waiting for the resize to actually stop means one real re-render
        // instead of dozens, at the cost of the page briefly staying at its
        // old size for the last ~150ms of the animation — imperceptible
        // next to the box's own motion.
        let timeoutId: number
        const observer = new ResizeObserver(() => {
            clearTimeout(timeoutId)
            timeoutId = window.setTimeout(measure, 150)
        })
        observer.observe(containerRef.current)
        return () => {
            clearTimeout(timeoutId)
            observer.disconnect()
        }
    }, [])

    return (
        <div ref={containerRef} className={styles.pdfContainer}>
            {pageWidth > 0 && (
                <Document
                    file="/AmandaRobinsonResume.pdf"
                    onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                    className={styles.pdfFrame}
                >
                    {Array.from({ length: numPages }, (_, i) => (
                        <Page
                            key={i}
                            pageNumber={i + 1}
                            width={pageWidth}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                        />
                    ))}
                </Document>
            )}
        </div>
    )
}
