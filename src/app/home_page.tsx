'use client'
import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import Image from 'next/image'

import styles from './styles/home_page.module.css'
import { clipToShape, TintedVector } from './mask_functions'
import { GreenOrb, RedOrb, YellowOrb, BlueOrb } from './sliders'
import { AppIntroContext } from './app_shell'

// Shrinks the ref'd element (as one unit, via a CSS custom property the
// caller applies through a transform: scale()) so it always fits within the
// viewport height instead of needing to scroll. scrollHeight is a layout
// metric — unaffected by the element's own transform — so this reads the
// content's true/natural height regardless of whatever scale is already
// applied, and never scales UP past 1, so content that already fits renders
// at its normal size. useLayoutEffect (not useEffect) so the correct scale is
// set before the first paint, rather than flashing at natural size for a
// frame first.
function useScaleToFit<T extends HTMLElement>(cssVar: string) {
    const ref = useRef<T>(null)

    useLayoutEffect(() => {
        const measure = () => {
            if (!ref.current) return
            const scale = Math.min(1, window.innerHeight / ref.current.scrollHeight)
            ref.current.style.setProperty(cssVar, `${scale}`)
        }
        measure()
        window.addEventListener('resize', measure)
        return () => window.removeEventListener('resize', measure)
    }, [cssVar])

    return ref
}

// Measures .overview's own rendered height and writes it back as a custom
// property on that same element — home_page.module.css's mobile
// .overviewBackground rule reads it back via var() to size itself, instead
// of the more obvious top:0/left:0/right:0/bottom:0 "stretch to fill"
// technique (tried first): that only reliably resolves against a
// containing block with a genuinely DEFINITE height, and .overview's mobile
// height is auto (min-height:100vh, but actually taller once
// .overviewContent's real, stacked-on-mobile content exceeds that) — a real
// browser was confirmed (not just suspected) to leave .overviewBackground
// stuck at exactly 100vh regardless of how much taller .overview's own
// content actually made it, the same category of auto-height stretch bug
// already hit (and fixed the same way — measure, don't rely on CSS
// alone) for the resume box and the footer background elsewhere in this
// codebase. Runs unconditionally (not gated to mobile) since it's cheap and
// the resulting property is simply unused by desktop's own
// .overviewBackground rule.
function useMeasuredHeight<T extends HTMLElement>(cssVar: string) {
    const ref = useRef<T>(null)

    useLayoutEffect(() => {
        const measure = () => {
            if (!ref.current) return
            ref.current.style.setProperty(cssVar, `${ref.current.getBoundingClientRect().height}px`)
        }
        measure()
        window.addEventListener('resize', measure)
        return () => window.removeEventListener('resize', measure)
    }, [cssVar])

    return ref
}

function OverviewSection() {
    const contentRef = useScaleToFit<HTMLDivElement>('--overview-scale')
    const overviewRef = useMeasuredHeight<HTMLDivElement>('--overview-real-height')

    return (
        <div className={styles.overview} ref={overviewRef}>
            {/* Outside .overviewContent on purpose — this is a full-bleed 100vw/100vh
                backdrop, so it shouldn't shrink along with the scaled content. */}
            <TintedVector src="/masks/Green-Memphis.svg" color='#D4D5E9' width='100vw' height='100vh' maskSize="cover" className={styles.overviewBackground}/>
            <div className={styles.overviewContent} ref={contentRef}>
                <div className={styles.upperSection}>
                    <div className={styles.blurb}>
                        <p>Hi! I&#39;m Amanda. I build things that make people&#39;s lives easier. I am energized by untangling complex problems and turning creative ideas into technology people can actually use.</p>
                    </div>
                    <div className={styles.headshotContainer}>
                        {/* Explicit width/height (the source file's real
                            2401x3600) instead of fill — fill's own
                            object-fit:cover would re-crop against this
                            container's square-ish box using ITS OWN default
                            crop point, different from the specific
                            scale/translate/rotate below that was tuned by
                            eye to center the face well within the circular
                            mask. sizes tells Next.js how big this actually
                            renders on screen, so it can serve a properly
                            downscaled image instead of the full source. */}
                        <Image
                            src="/headshot.jpg"
                            alt="Amanda Robinson smiling against a dark background"
                            width={2401}
                            height={3600}
                            sizes="(max-width: 700px) 140px, 12.5vw"
                            className={styles.headshot}
                        />
                    </div>
                </div>
                <div className={styles.lowerSection}>
                    <div className={styles.techStacks}>
                        <h2 className={styles.sectionTitle}>Technology Stacks</h2>
                        <div className={styles.bodyText}>
                            <b>Languages: </b>
                            <p>Java, Python, TypeScript, HTML/CSS, SQL, C++, C</p>
                            <b>Frameworks/Libraries: </b>
                            <p>React, Bootstrap, Next.js, Node.js/Express, PySide6</p>
                            <b>Tools: </b>
                            <p>Git, VS Code, Claude Code, Warp, Linux</p>
                            <b>Other: </b>
                            <p>MySQL, PostgreSQL, SQL Server, AWS, Figma</p>
                        </div>
                    </div>
                    <div className={styles.education}>
                        <h2 className={styles.sectionTitle}>Education</h2>
                        <div className={styles.bodyText}>
                            <b>Worcester Polytechnic Institute</b>
                            <p>Expected Graduation: May 2028</p>
                            <p>B.S. Computer Science</p>
                            <p>Minor in Economics</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


// Each orb's size is now defined purely in CSS (see .redOrb etc. in
// home_page.module.css) — this reads back the real rendered pixel width of
// that box via a ref, since TintedVector still needs an actual number (not a
// CSS clamp() string) to size the mask so it fills the frame correctly. The
// resize listener keeps it in sync as the CSS clamp() value changes; `initial`
// is just the SSR-safe/first-paint guess (each orb's own clamp() preferred
// value) before the ref can be measured.
function useElementWidth<T extends HTMLElement>(initial: number) {
    const ref = useRef<T>(null)
    const [width, setWidth] = useState(initial)

    useEffect(() => {
        const measure = () => {
            if (ref.current) setWidth(ref.current.getBoundingClientRect().width)
        }
        measure()
        window.addEventListener('resize', measure)
        return () => window.removeEventListener('resize', measure)
    }, [])

    return [ref, width] as const
}

export default function HomePage() {
    const playIntro = useContext(AppIntroContext)
    const [redOrbRef, redOrbWidth] = useElementWidth<HTMLDivElement>(275)
    const [yellowOrbRef, yellowOrbWidth] = useElementWidth<HTMLDivElement>(425)
    const [greenOrbRef, greenOrbWidth] = useElementWidth<HTMLDivElement>(350)
    const [blueOrbRef, blueOrbWidth] = useElementWidth<HTMLDivElement>(300)

    return (
        <div className={styles.home}>
            <TintedVector src="/masks/cow-blobs.svg" color='#F7EEE3' repeat maskSize="70%" className={styles.homeBackground}/>
            <div className={styles.orbs}>
                <div className={`${styles.redOrb} ${playIntro ? styles.redOrbIntro : ''}`} ref={redOrbRef}>
                    <RedOrb size={`${redOrbWidth}px`} className={`${styles.orbShadowRed} ${playIntro ? styles.orbShadowRedIntro : ''}`} />
                </div>
                <div className={`${styles.yellowOrb} ${playIntro ? styles.yellowOrbIntro : ''}`} ref={yellowOrbRef}>
                    <YellowOrb size={`${yellowOrbWidth}px`} className={`${styles.orbShadowYellow} ${playIntro ? styles.orbShadowYellowIntro : ''}`} />
                </div>
                <div className={`${styles.greenOrb} ${playIntro ? styles.greenOrbIntro : ''}`} ref={greenOrbRef}>
                    <GreenOrb size={`${greenOrbWidth}px`} className={`${styles.orbShadowGreen} ${playIntro ? styles.orbShadowGreenIntro : ''}`} />
                </div>
                <div className={`${styles.blueOrb} ${playIntro ? styles.blueOrbIntro : ''}`} ref={blueOrbRef}>
                    <BlueOrb size={`${blueOrbWidth}px`} className={`${styles.orbShadowBlue} ${playIntro ? styles.orbShadowBlueIntro : ''}`} />
                </div>
            </div>
            {/* <div className={styles.sliders}>
                <AllSliders height='285px'/>
            </div> */}
            <header className={styles.mainText}>
                <div className={styles.nameSection}>
                    <div className={styles.blobMask}>
                        {/* Sized as a fixed ratio of --text-block-width (defined in
                            home_page.module.css on .nameSection, the same value
                            .nameStack's own width uses) instead of its own independent
                            clampPx call, so the blob always stays proportional to the
                            name text rather than scaling on a separate formula. 827.5/900
                            preserves the original blob-to-text-block size ratio. */}
                        <TintedVector
                            src="/masks/Blob.svg"
                            color="#FFB2B3"
                            width="calc(var(--text-block-width) * 827.5 / 900)"
                            style={{opacity: "80%"}}
                        />
                    </div>
                    <svg
                        className={styles.nameStack}
                        viewBox="0 0 900 300"
                        role="img"
                        aria-label="Amanda Robinson"
                    >
                        <text x="50%" y="128" textAnchor="middle" className={styles.svgNameText} fill="#5B5F97" stroke="#F5DFB4" strokeWidth="4">Amanda</text>
                        <text x="50%" y="272" textAnchor="middle" className={styles.svgNameText} fill="#5B5F97" stroke="#F5DFB4" strokeWidth="4">Robinson</text>
                    </svg>
                </div>
                <div className={styles.subtitleSection}>
                    <p className={styles.subtitle}>Builder of unique and effective software</p>
                </div>
            </header>
            <OverviewSection/>
        </div>
    )
}
